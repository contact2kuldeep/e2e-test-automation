import { prettyPrint } from 'utils/pretty-print';
import { addMessage } from 'utils/reporter/custom-reporter';

export function Examples<T>(func: (example: T) => void, examples: T[]) {
  examples.forEach(e => func(e));
}

interface ITContextResult<T, C extends {}> {
  result?: T;
  context: C;
}

type TStepFunction<TPreviousResult, TPreviousContext, TResult> = (
  previousResult: TPreviousResult,
  context: TPreviousContext,
) => TResult;

type TExtractResult<
  TStepFunctionResult
> = TStepFunctionResult extends ITContextResult<infer T, any>
  ? T
  : TStepFunctionResult;

type TExtractContext<
  TStepFunctionResult,
  TPreviousContext
> = TStepFunctionResult extends ITContextResult<any, infer C>
  ? C & TPreviousContext
  : TPreviousContext;

export function Given<T>(func: () => T) {
  gherkinLog('\nGiven ');
  processStepfunctionName(func);
  const initialResult = { result: undefined, context: {} };
  return new ChainedStep<TExtractResult<T>, TExtractContext<T, {}>>(
    convertToContextResult(initialResult, func()),
  );
}

export type TChainedStep<
  TPreviousResult,
  TPreviousContext extends {}
> = ChainedStep<TPreviousResult, TPreviousContext>;

class ChainedStep<TPreviousResult, TPreviousContext extends {}> {
  /* tslint:disable:variable-name */
  public When = this.step('\nWhen ');
  public Then = this.step('\nThen ');
  public And = this.step('\n  And ');
  public But = this.step('\n  But ');
  /* tslint:enable */
  constructor(
    private previousResult: ITContextResult<TPreviousResult, TPreviousContext>,
  ) {}

  public multiSteps = <TPR, TPC>(
    func: (
      step: ChainedStep<TPreviousResult, TPreviousContext>,
    ) => ChainedStep<TPR, TPC>,
  ) => func(this);

  private step(stepName: string) {
    return <TResult>(
      func: TStepFunction<TPreviousResult, TPreviousContext, TResult>,
    ): ChainedStep<
      TExtractResult<TResult>,
      TExtractContext<TResult, TPreviousContext>
    > => {
      gherkinLog(stepName);
      processStepfunctionName(func);
      return new ChainedStep(
        convertToContextResult(
          this.previousResult,
          func(this.previousResult.result!, this.previousResult.context),
        ),
      );
    };
  }
}

function convertToContextResult<TPreviousResult, TPreviousContext, TResult>(
  previousResult: ITContextResult<TPreviousResult, TPreviousContext>,
  result: TResult,
): ITContextResult<
  TExtractResult<TResult>,
  TExtractContext<TResult, TPreviousContext>
> {
  let contextResult;

  if (isContextResult<TResult>(result)) {
    contextResult = {
      result: result.result,
      context: {
        ...(previousResult.context as {}),
        ...(result.context as {}),
      },
    };
  } else {
    contextResult = {
      result: result as TExtractResult<TResult>,
      context: previousResult.context,
    };
  }

  return {
    ...contextResult,
    context: {
      ...(contextResult.context as {}),
    } as TExtractContext<TResult, TPreviousContext>,
  };
}

function isContextResult<T>(
  result: any,
): result is ITContextResult<TExtractResult<T>, TExtractContext<T, {}>> {
  if (
    typeof result === 'object' &&
    typeof (result as any).context === 'object'
  ) {
    return true;
  }
  return false;
}

function processStepfunctionName(func: Function) {
  const processedName = func.name.replace(/^_/, '').replace(/_/g, ' ');
  gherkinLog(processedName);
}

/**
 * This converts a function into a parameterised step function.
 * It also take care of adding the steps to context.
 * @param func a function that takes 2-3 params.  The first param
 * is the parameters to pass in when calling the step function. The
 * second param is the expected result type returned by the previous
 * step.  The third param is an optional context.
 *
 * IMPORTANT: use named function as oppose to anonymous arrow functions
 * so that context logging will read better.
 */
export function convertToParameterisedStep<TParameter, TResult>(
  func: (param: TParameter) => TResult,
): (param: TParameter) => () => TResult;
export function convertToParameterisedStep<
  TParameter,
  TPreviousResult,
  TResult,
  TContext extends {} = {}
>(
  func: (
    param: TParameter,
    previousResult: TPreviousResult,
    context: TContext,
  ) => TResult,
): (
  param: TParameter,
) => (previousResult: TPreviousResult, context: TContext) => TResult;
export function convertToParameterisedStep<
  TParameter,
  TPreviousResult,
  TResult,
  TContext extends {} = {}
>(
  func: (
    param: TParameter,
    previousResult: TPreviousResult,
    context: TContext,
  ) => TResult,
) {
  return (param: TParameter) => {
    // this is done so that the steps can simply log the function name
    const stepFnuction = {
      // create a function with the same name as the function passed in
      [func.name]: (previousResult: TPreviousResult, context: TContext) => {
        gherkinLog(' ' + prettyPrint(param));
        return func(param, previousResult, context);
      },
    };
    return stepFnuction[func.name];
  };
}

export function gherkinLog(text: string) {
  process.stdout.write(text);
  addMessage(text);
}

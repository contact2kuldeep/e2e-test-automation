interface IOptions {
  errorMessage?: string;
  maxTries?: number;
  waitBetweenTries?: number;
  /** Mainly used during debugging */
  logError?: boolean;
  /**
   * Test success condition every 0.5s between tries.
   * Useful for navigating between pages where you want move
   * on as soon as the page is loaded, but want to try clicking
   * on the navigation button again after a period of time to
   * try again.
   */
  aggressiveWait?: boolean;
}

export const utils = {
  waitUntil: (successCondition: () => boolean, options?: IOptions) =>
    utils.tryUntil(null, successCondition, {
      waitBetweenTries: 1000,
      maxTries: 60,
      ...options,
    }),
  /** keep trying some actions until some conditions become true */
  tryUntil: (
    thingsToTry: null | (() => void),
    successCondition: () => boolean,
    options?: IOptions,
  ) => {
    const {
      errorMessage,
      maxTries,
      waitBetweenTries,
      logError,
      aggressiveWait,
    }: NonNullable<Required<typeof options>> = {
      errorMessage: 'Exceeded maximum tries',
      maxTries: 10,
      waitBetweenTries: 500,
      logError: true,
      aggressiveWait: false,
      ...options,
    };

    const waitBetweenAggressiveWait = 500;

    let noOfTries = 0;

    while (noOfTries < maxTries) {
      try {
        if (thingsToTry) {
          thingsToTry();
        }
      } catch (e) {
        handleTerminationException(e);
        if (logError) {
          console.log('Error encountered when executing thingsToTry():');
          console.log(e);
        }
      }

      if (aggressiveWait) {
        try {
          utils.tryUntil(null, successCondition, {
            maxTries: waitBetweenTries / waitBetweenAggressiveWait,
            waitBetweenTries: waitBetweenAggressiveWait,
            logError,
          });
        } catch (e) {
          handleTerminationException(e);
        }
      }

      try {
        if (successCondition()) {
          return;
        }
      } catch (e) {
        handleTerminationException(e);
      }

      if (!aggressiveWait) {
        browser.pause(waitBetweenTries);
      }
      noOfTries++;
    }

    if (logError) {
      console.log(errorMessage);
    }
    throw errorMessage;
  },
};

const terminateError = Symbol('terminatedError!');

function handleTerminationException(e: any) {
  if (e === terminateError) {
    throw terminateError;
  }

  if (
    e &&
    e.message &&
    (e.message.indexOf('ECONNREFUSED') > -1 ||
      e.message.indexOf('CHANNEL_CLOSED') > -1)
  ) {
    console.log('Program terminated, no point in retrying');
    throw terminateError;
  }
}

import { withTracker, ReactiveDict } from '@meteorrn/core';


const ERROR_KEY = 'subsError';

/**
 * Wraps the query and provides reactive data fetching utility
 *
 * @param handler
 * @param config
 * @param QueryComponent
 */
export default function withReactiveContainer(handler, config, QueryComponent) {
  let hasBeenReady = false;
  let subscriptionError = new ReactiveDict();
  const { loadOnRefetch = true } = config;

  return withTracker((props) => {
    const query = handler(props);

    const subscriptionHandle = query.subscribe({
      onStop(err) {
        if (err) {
          subscriptionError.set(ERROR_KEY, err);
        }
      },
      onReady() {
        subscriptionError.set(ERROR_KEY, null);
      },
    });

    const isReady = subscriptionHandle.ready();

    if (!loadOnRefetch && !hasBeenReady && isReady) {
      hasBeenReady = true;
    }

    const data = query.fetch();
    const isLoading = loadOnRefetch ? !isReady : !hasBeenReady && !isReady;

    return {
      grapher: {
        isLoading,
        data,
        error: subscriptionError.get(ERROR_KEY),
      },
      query,
      config,
      props,
    };
  })(errorTracker(QueryComponent));
}

const errorTracker = withTracker((props) => {
  const error = props.grapher.error.get();

  return {
    ...props,
    grapher: {
      ...props.grapher,
      error,
    },
  };
});

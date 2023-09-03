import React from 'react';

import defaults from './defaults';
import withStaticQuery from './lib/withStaticQuery';
import withReactiveQuery from './lib/withReactiveQuery';
import withQueryContainer from './lib/withQueryContainer';


export default function withQuery(handler, _config = {}) {
  const config = Object.assign({}, defaults, _config);

  return function(component) {
    const queryContainer = withQueryContainer(component);

    if (!config.reactive) {
      const staticQueryContainer = withStaticQuery(config)(queryContainer);

      return React.memo(function(props) {
        const query = handler(props);

        return React.createElement(staticQueryContainer, {
          query,
          props,
          config,
        });
      });
    } else {
      throw new Error('Reactive queries are not supported yet');
      // return withReactiveQuery(handler, config, queryContainer);
    }
  };
}

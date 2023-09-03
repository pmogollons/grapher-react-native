import React from 'react';
import PropTypes from 'prop-types';

import Query from './Query';
import getDisplayName from './getDisplayName';


const propTypes = {
  grapher: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    data: PropTypes.array,
    query: PropTypes.oneOfType([
      PropTypes.instanceOf(Query),
    ]),
  }).isRequired,
  config: PropTypes.object.isRequired,
  props: PropTypes.object,
};

export default function withQueryContainer(WrappedComponent) {
  let GrapherQueryContainer = function({ grapher, config, query, props }) {
    const { isLoading, error, data, count } = grapher;
    const { propSuffix = '' } = config;
    const { refetch, ...rest } = props;

    if (error && config.errorComponent) {
      return React.createElement(config.errorComponent, {
        error,
        query,
        refetch,
      });
    }

    if (isLoading && config.loadingComponent) {
      return React.createElement(config.loadingComponent, {
        query,
      });
    }

    const newData = config.single ? data[0] : data;

    return React.createElement(WrappedComponent, {
      ...rest,
      [`refetch${propSuffix}`]: refetch,
      [`isLoading${propSuffix}`]: error ? false : isLoading,
      [`error${propSuffix}`]: error,
      [`count${propSuffix}`]: count,
      [`query${propSuffix}`]: query,
      [config.dataProp]: newData || props[config.dataProp],
    });
  };

  GrapherQueryContainer.propTypes = propTypes;
  GrapherQueryContainer.displayName = `GrapherQuery(${getDisplayName(WrappedComponent)})`;

  return GrapherQueryContainer;
}

import React from 'react';

import getDisplayName from './getDisplayName';


export default function withStaticQueryContainer(config) {
  return function(WrappedComponent) {
    /**
     * We use it like this, so we can have naming inside React Dev Tools
     * This is a standard pattern in HOCs
     */
    class GrapherStaticQueryContainer extends React.Component {
      _isMounted = true;

      state = {
        isLoading: true,
        error: null,
        data: [],
      };

      _setState = (state, callback) => {
        if (this._isMounted) {
          this.setState(state, callback);
        }
      };

      UNSAFE_componentWillReceiveProps(nextProps) {
        let append = false;
        const { query } = nextProps;

        if (this.props.query._params.skip < query._params.skip && query._params.skip > 1) {
          append = config.appendData;
        }

        if (!config.shouldRefetch) {
          this.fetch(query, append);
        } else if (config.shouldRefetch(this.props, nextProps)) {
          this.fetch(query, append);
        }
      }

      componentDidMount() {
        const { query, config } = this.props;
        this.fetch(query);

        if (config.pollingMs) {
          this.pollingInterval = setInterval(() => {
            this.fetch();
          }, config.pollingMs);
        }
      }

      componentWillUnmount() {
        this._isMounted = false;
        this.pollingInterval && clearInterval(this.pollingInterval);
      }

      async fetch(query, append) {
        if (!query) {
          query = this.props.query;
        }

        try {
          let count;
          const data = await query.fetch();

          if (config.getCount === true) {
            count = await query.getCount();
          }

          this._setState({
            data: append ? [...this.state.data, ...data] : data,
            count,
            error: null,
            isLoading: false,
          });
        } catch (error) {
          this._setState({
            data: [...this.state.data],
            error,
            isLoading: false,
          });
        }
      }

      refetch = (overrideLoadOnRefetch) => {
        let { loadOnRefetch = true } = config;
        const { query } = this.props;

        if (overrideLoadOnRefetch !== undefined) {
          loadOnRefetch = overrideLoadOnRefetch;
        }

        if (loadOnRefetch) {
          this._setState({ isLoading: true }, () => {
            this.fetch(query);
          });
        } else {
          this.fetch(query);
        }
      };

      render() {
        const { config, props, query } = this.props;

        return React.createElement(WrappedComponent, {
          grapher: this.state,
          config,
          query,
          props: { ...props, refetch: this.refetch },
        });
      }
    }

    GrapherStaticQueryContainer.displayName = `StaticQuery(${getDisplayName(
      WrappedComponent,
    )})`;

    return GrapherStaticQueryContainer;
  };
}

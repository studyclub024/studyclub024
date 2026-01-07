import React from 'react';

type State = {
  hasError: boolean;
  error?: Error | null;
  info?: any;
};

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('Caught error in ErrorBoundary', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: '#b91c1c', background: '#fff7f7' }}>
          <h3>Something went wrong rendering this view.</h3>
          <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>
            {this.state.error?.message}
            {this.state.info ? '\n' + JSON.stringify(this.state.info) : null}
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

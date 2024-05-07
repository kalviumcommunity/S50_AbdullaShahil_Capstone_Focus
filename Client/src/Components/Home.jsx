import React, { Suspense, lazy } from 'react';
import Header from './Home Components/Header';
import Posts from './Home Components/Posts';

const LazyUserPanel = lazy(() => import('./Home Components/UserPanel'));
const LazyNavigation = lazy(() => import('./Home Components/Navigation'));

import 'ldrs/tailspin'
import 'ldrs/ring'


function Home() {
  return (
    <div>
      <Header />
      <div className="flex justify-around">

        <Suspense fallback={<l-ring
          size="40"
          stroke="5"
          bg-opacity="0"
          speed="2"
          color="#2E93FF"
        ></l-ring>}>
          <LazyNavigation />
        </Suspense>

        <Posts />

        <Suspense fallback={<l-ring
          size="40"
          stroke="5"
          bg-opacity="0"
          speed="2"
          color="#2E93FF"
        ></l-ring>}>
          <LazyUserPanel />
        </Suspense>

      </div>
    </div>
  );
}

export default Home;

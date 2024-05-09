import React, { Suspense, lazy } from 'react';
import Header from './Home Components/Header';
import Articles from './LensHub Components/Articles';

const LazyNavigation = lazy(() => import('./Home Components/Navigation'));

import 'ldrs/tailspin'
import 'ldrs/ring'

const articleTemplate = "Write an Article";
const navigateTo = "/write";

function LazyNavigationWrapper() {
  return (
    <Suspense fallback={<l-ring
      size="40"
      stroke="5"
      bg-opacity="0"
      speed="2"
      color="#2E93FF"
    ></l-ring>}>
      <LazyNavigation template={articleTemplate} navigateTo={navigateTo} />
    </Suspense>
  );
}

function LensHub() {
  return (
    <div>
      <Header />
      <div className="flex justify-around">
        <LazyNavigationWrapper />
        <Articles />
      </div>
    </div>
  );
}

export default LensHub;

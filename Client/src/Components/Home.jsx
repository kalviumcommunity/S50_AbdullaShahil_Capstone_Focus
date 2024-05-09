import React, { Suspense, lazy } from 'react';
import Header from './Home Components/Header';
import Posts from './Home Components/Posts';

const LazyUserPanel = lazy(() => import('./Home Components/UserPanel'));
const LazyNavigation = lazy(() => import('./Home Components/Navigation'));

import 'ldrs/tailspin'
import 'ldrs/ring'

const postTemplate = "Create a post";
const navigateTo = "/post";

// Create a wrapper component for LazyNavigation to pass props
function LazyNavigationWrapper() {
  return (
    <Suspense fallback={<l-ring
      size="40"
      stroke="5"
      bg-opacity="0"
      speed="2"
      color="#2E93FF"
    ></l-ring>}>
      <LazyNavigation template={postTemplate} navigateTo={navigateTo} />
    </Suspense>
  );
}

function Home() {
  return (
    <div>
      <Header />
      <div className="flex justify-around">
        <LazyNavigationWrapper />
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

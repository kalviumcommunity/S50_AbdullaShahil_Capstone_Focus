import React, { Suspense, lazy, useState } from 'react';
import Header from './Home Components/Header';
import Articles from './LensHub Components/Articles';

const LazyNavigation = lazy(() => import('./Home Components/Navigation'));

import 'ldrs/tailspin'
import 'ldrs/ring'

const articleTemplate = "Write an Article";
const navigateTo = "/write";

function LazyNavigationWrapper({ setArticleCategory }) {
  return (
    <Suspense fallback={<l-ring
      size="40"
      stroke="5"
      bg-opacity="0"
      speed="2"
      color="#2E93FF"
    ></l-ring>}>
      <LazyNavigation type="article" template={articleTemplate} navigateTo={navigateTo} setArticleCategory={setArticleCategory} />
    </Suspense>
  );
}

function LensHub() {
  const [articleCategory, setArticleCategory] = useState(null);

  return (
    <div>
      <Header />
      <div className="flex justify-around">
        <LazyNavigationWrapper setArticleCategory={setArticleCategory} />
        <Articles articleCategory={articleCategory} />
      </div>
    </div>
  );
}

export default LensHub;

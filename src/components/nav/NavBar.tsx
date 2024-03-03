import React from 'react';
import SearchModal from './SearchModal';

class NavBar extends React.Component<{ currentPath: string }> {
  render() {
    const isHome = this.props.currentPath === "/";
    const isPortfolio = this.props.currentPath.includes("portfolio");
    const isBlog = this.props.currentPath.includes("blog");
    const isQuiz = this.props.currentPath.includes("quiz");
    const homeClasses = `block py-2 px-3 text-white bg-gray-700 rounded md:bg-transparent md:p-0 ${isHome ? 'md:text-gray-500 md:dark:text-gray-500' : 'md:text-black md:dark:text-white md:hover:text-gray-500 md:dark:hover:text-gray-500'}`;
    const portfolioClasses = `flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-portfolio-500 md:p-0 md:w-auto dark:text-white md:dark:hover:text-portfolio-200 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent ${isPortfolio ? 'md:text-portfolio-500 md:dark:text-portfolio-300' : 'md:text-black md:dark:text-white md:hover:text-portfolio-500 md:dark:hover:text-portfolio-200'}`;
    const blogClasses = `flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blog-500 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blog-200 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent ${isBlog ? 'md:text-blog-500 md:dark:text-blog-300' : 'md:text-black md:dark:text-white md:hover:text-blog-500 md:dark:hover:text-blog-200'}`;
    const quizClasses = `flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-quiz-500 md:p-0 md:w-auto dark:text-white md:dark:hover:text-quiz-200 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent ${isQuiz ? 'md:text-quiz-500 md:dark:text-quiz-300' : 'md:text-black md:dark:text-white md:hover:text-quiz-500 md:dark:hover:text-quiz-200'}`;
    return <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/img/desmosito-black-trans.png" className="h-8 dark:invert" alt="Desmosito Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Izz Hafeez</span>
        </a>
        <div className="flex md:order-2">
          <button id="theme-toggle" type="button" className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
            <svg id="theme-toggle-light-icon" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </button>
          <button type="button" data-modal-toggle="search-modal" className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <SearchModal/>
          <button data-collapse-toggle="navbar-search" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-search" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-search">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="/" className={homeClasses} aria-current="page">Home</a>
            </li>
            <li>
              <button id="portfolioNavbarLink" data-dropdown-toggle="portfolioNavbar" className={portfolioClasses}>Portfolio <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
              </button>
              <div id="portfolioNavbar" className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li>
                    <a href="/portfolio" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">All</a>
                  </li>
                  <li>
                    <a href="/portfolio/artwork" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">Artwork</a>
                  </li>
                  <li>
                    <a href="/portfolio/award" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">Awards</a>
                  </li>
                  <li>
                    <a href="/portfolio/certificate" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">Certificates</a>
                  </li>
                  <li>
                    <a href="/portfolio/experience" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">Experiences</a>
                  </li>
                  <li>
                    <a href="/portfolio/language" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">Languages</a>
                  </li>
                  <li>
                    <a href="/portfolio/module" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-whitCoursese">Modules</a>
                  </li>
                  <li>
                    <a href="/portfolio/music" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">Music</a>
                  </li>
                  <li>
                    <a href="/portfolio/skill" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">Skills</a>
                  </li>
                  <li>
                    <a href="/portfolio/technology" className="block px-4 py-2 hover:bg-portfolio-100 dark:hover:bg-portfolio-600 dark:hover:text-white">Technologies</a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button id="blogNavbarLink" data-dropdown-toggle="blogNavbar" className={blogClasses}>Blog <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
              </button>
              <div id="blogNavbar" className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li>
                    <a href="/blog" className="block px-4 py-2 hover:bg-blog-100 dark:hover:bg-blog-600 dark:hover:text-white">All</a>
                  </li>
                  <li>
                    <a href="/blog/hike" className="block px-4 py-2 hover:bg-blog-100 dark:hover:bg-blog-600 dark:hover:text-white">Hikes</a>
                  </li>
                  <li>
                    <a href="/blog/mall" className="block px-4 py-2 hover:bg-blog-100 dark:hover:bg-blog-600 dark:hover:text-white">Malls</a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button id="quizNavbarLink" data-dropdown-toggle="quizNavbar" className={quizClasses}>Quizzes <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
              </button>
              <div id="quizNavbar" className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li>
                    <a href="/quiz" className="block px-4 py-2 hover:bg-quiz-100 dark:hover:bg-quiz-600 dark:hover:text-white">All</a>
                  </li>
                  <li>
                    <a href="/quiz/guess" className="block px-4 py-2 hover:bg-quiz-100 dark:hover:bg-quiz-600 dark:hover:text-white">Guess</a>
                  </li>
                  <li>
                    <a href="/quiz/map" className="block px-4 py-2 hover:bg-quiz-100 dark:hover:bg-quiz-600 dark:hover:text-white">Map</a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>;
  }
}

export default NavBar;
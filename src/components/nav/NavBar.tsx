import React from 'react';
import SearchModal from './SearchModal';

class NavBar extends React.Component<{ currentPath: string }> {
  render() {
    const isHome = this.props.currentPath === "/";
    const isMerits = this.props.currentPath.includes("merits");
    const isProjects = this.props.currentPath.includes("projects");
    const homeClasses = `block py-2 px-3 text-white bg-gray-700 rounded md:bg-transparent md:p-0 ${isHome ? 'md:text-gray-500 md:dark:text-gray-500' : 'md:text-black md:dark:text-white md:hover:text-gray-500 md:dark:hover:text-gray-500'}`;
    const meritsClasses = `flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-merits-500 md:p-0 md:w-auto dark:text-white md:dark:hover:text-merits-300 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent ${isMerits ? 'md:text-merits-500 md:dark:text-merits-500' : 'md:text-black md:dark:text-white md:hover:text-merits-500 md:dark:hover:text-merits-500'}`;
    const projectsClasses = `flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-projects-500 md:p-0 md:w-auto dark:text-white md:dark:hover:text-projects-300 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent ${isProjects ? 'md:text-projects-500 md:dark:text-projects-500' : 'md:text-black md:dark:text-white md:hover:text-projects-500 md:dark:hover:text-projects-500'}`;
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
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="text" id="search-navbar" className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..."></input>
          </div>
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a href="/" className={homeClasses} aria-current="page">Home</a>
            </li>
            <li>
              <button id="meritsNavbarLink" data-dropdown-toggle="meritsNavbar" className={meritsClasses}>Merits <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
              </button>
              <div id="meritsNavbar" className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li>
                    <a href="/merits/awards" className="block px-4 py-2 hover:bg-merits-100 dark:hover:bg-merits-600 dark:hover:text-white">Awards</a>
                  </li>
                  <li>
                    <a href="/merits/certificates" className="block px-4 py-2 hover:bg-merits-100 dark:hover:bg-merits-600 dark:hover:text-white">Certificates</a>
                  </li>
                  <li>
                    <a href="/merits/experiences" className="block px-4 py-2 hover:bg-merits-100 dark:hover:bg-merits-600 dark:hover:text-white">Experiences</a>
                  </li>
                  <li>
                    <a href="/merits/languages" className="block px-4 py-2 hover:bg-merits-100 dark:hover:bg-merits-600 dark:hover:text-white">Languages</a>
                  </li>
                  <li>
                    <a href="/merits/modules" className="block px-4 py-2 hover:bg-merits-100 dark:hover:bg-merits-600 dark:hover:text-whitCoursese">Modules</a>
                  </li>
                  <li>
                    <a href="/merits/skills" className="block px-4 py-2 hover:bg-merits-100 dark:hover:bg-merits-600 dark:hover:text-white">Skills</a>
                  </li>
                  <li>
                    <a href="/merits/technologies" className="block px-4 py-2 hover:bg-merits-100 dark:hover:bg-merits-600 dark:hover:text-white">Technologies</a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button id="projectsNavbarLink" data-dropdown-toggle="projectsNavbar" className={projectsClasses}>Projects <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/></svg>
              </button>
              <div id="projectsNavbar" className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLargeButton">
                  <li>
                    <a href="/projects/coding" className="block px-4 py-2 hover:bg-projects-100 dark:hover:bg-projects-600 dark:hover:text-white">Coding</a>
                  </li>
                  <li>
                    <a href="/projects/graphs" className="block px-4 py-2 hover:bg-projects-100 dark:hover:bg-projects-600 dark:hover:text-white">Graphs</a>
                  </li>
                  <li>
                    <a href="/projects/music" className="block px-4 py-2 hover:bg-projects-100 dark:hover:bg-projects-600 dark:hover:text-white">Music</a>
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
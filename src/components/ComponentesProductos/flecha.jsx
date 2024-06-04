import React, { useEffect } from 'react';
import { scrollend } from 'https://cdn.jsdelivr.net/gh/argyleink/scrollyfills@latest/dist/scrollyfills.modern.js';

const PullToRefreshComponent = () => {
  useEffect(() => {
    const ptr_scrollport = document.querySelector('html');
    const ptr = document.querySelector('#refresh');
    const main = document.querySelector('#refresh-main');

    const determinePTR = (event) => {
      if (event.target.scrollTop <= 0) {
        ptr.querySelector('span').textContent = 'refreshing...';
        ptr.setAttribute('loading-state', 'loading');

        // Simulated response
        setTimeout(() => {
          ptr.querySelector('span').textContent = 'done!';

          setTimeout(() => {
            ptr.removeAttribute('loading-state');
            main.scrollIntoView({ behavior: 'smooth' });

            window.addEventListener('scrollend', () => {
              ptr.querySelector('span').textContent = 'Pull to refresh';
            }, { once: true });
          }, 500);
        }, 2000);
      }
    };

    window.addEventListener('scrollend', () => {
      determinePTR({ target: ptr_scrollport });
    });

    return () => {
      window.removeEventListener('scrollend', determinePTR);
    };
  }, []);

  return (
    <>
      <header id="refresh" className="h-36 w-full bg-gray-200  grid gap-4 place-content-center place-items-center relative">
        <svg viewBox="0 0 24 24" width="80" height="80" className="animate-rotate-in">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
        <span className="animate-fade-out">Pull to refresh</span>
      </header>
      
    </>
  );
};

export default PullToRefreshComponent;
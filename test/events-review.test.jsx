import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { createInstance } from 'i18next';
import { afterEach, expect, it, vi } from 'vitest';
import Events from '../src/components/eventos/Events';
import { eventsData } from '../src/data/newsData';
import es from '../public/locales/es/events.json';
import en from '../public/locales/en/events.json';
import fr from '../public/locales/fr/events.json';
vi.mock('../src/components/header', () => ({ Header: () => <nav /> }));
vi.mock('../src/components/footer', () => ({ default: () => <footer /> }));
const motionPreference = vi.hoisted(() => ({ reduced: true }));
vi.mock('framer-motion', () => ({ useReducedMotion: () => motionPreference.reduced, motion: new Proxy({}, { get: (_, tag) => tag }) }));
afterEach(() => { cleanup(); vi.useRealTimers(); motionPreference.reduced = true; });
async function open(path, lng='es') { const i18n=createInstance();await i18n.init({lng,defaultNS:'events',resources:{es:{events:es},en:{events:en},fr:{events:fr}},interpolation:{escapeValue:false}});return render(<I18nextProvider i18n={i18n}><MemoryRouter initialEntries={[path]}><Routes><Route path="/eventos" element={<Events/>}/><Route path="/eventos/:newsId" element={<Events/>}/></Routes></MemoryRouter></I18nextProvider>); }
it('opens the detail from the cover card', async()=>{await open('/eventos');fireEvent.click(screen.getByRole('heading',{name:es.items.parisDecoOff2027.title}));expect(screen.getByRole('link',{name:/PARIS DECO OFF 2027/})).toHaveAttribute('href','https://www.parisdeco-off.com/en');});
it('shows a progress bar without controls or thumbnails',async()=>{const {container}=await open('/eventos/paris-deco-off-2027');expect(container.querySelector('.event-gallery-progress span')).toHaveStyle({animationDuration:'5000ms'});expect(container.querySelector('.event-thumbnails')).toBeNull();expect(container.querySelector('.event-gallery-controls')).toBeNull();});
for(const [lang,copy] of Object.entries({es,en,fr}))it(`renders ${lang} article and paragraphs`,async()=>{await open('/eventos/paris-deco-off-2027',lang);expect(screen.getByRole('heading',{level:1})).toHaveTextContent(copy.items.parisDecoOff2027.title);expect(screen.getByText(copy.items.parisDecoOff2027.sections[2].paragraphs[1])).toBeInTheDocument();});
it('handles an unknown event',async()=>{await open('/eventos/unknown');expect(screen.getByRole('heading')).toHaveTextContent(es.notFoundTitle);});
for(const style of ['editorial','gallery','deco-off'])it(`renders ${style} layout`,async()=>{const original=eventsData[0].style;try{eventsData[0].style=style;const {container}=await open('/eventos/paris-deco-off-2027');expect(container.querySelector(`.event-style-${style}`)).toBeInTheDocument();expect(container.querySelectorAll('.event-fair')).toHaveLength(style==='deco-off'?1:0);}finally{eventsData[0].style=original;}});

it('advances every five seconds, resets progress and loops while hovered',async()=>{
 vi.useFakeTimers();
 const {container}=await open('/eventos/paris-deco-off-2027');
 const firstBar=container.querySelector('.event-gallery-progress span');
 fireEvent.mouseEnter(container.querySelector('.event-gallery'));
 act(()=>vi.advanceTimersByTime(4999));
 expect(container.querySelector('.event-gallery-image.is-active')).toHaveAttribute('src',eventsData[0].images[0]);
 act(()=>vi.advanceTimersByTime(1));
 expect(container.querySelector('.event-gallery-image.is-active')).toHaveAttribute('src',eventsData[0].images[1]);
 expect(container.querySelector('.event-gallery-progress span')).not.toBe(firstBar);
 act(()=>vi.advanceTimersByTime(5000));
 expect(container.querySelector('.event-gallery-image.is-active')).toHaveAttribute('src',eventsData[0].images[0]);
});

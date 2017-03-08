import { isBrowser } from '~/packages/inferno-shared/dist-es';
const isiOS = isBrowser && !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
const delegatedEvents = new Map();
export function handleEvent(name, lastEvent, nextEvent, dom) {
    let delegatedRoots = delegatedEvents.get(name);
    if (nextEvent) {
        if (!delegatedRoots) {
            delegatedRoots = {
                items: new Map(),
                count: 0,
                docEvent: null
            };
            delegatedRoots.docEvent = attachEventToDocument(name, delegatedRoots);
            delegatedEvents.set(name, delegatedRoots);
        }
        if (!lastEvent) {
            delegatedRoots.count++;
            if (isiOS && name === 'onClick') {
                trapClickOnNonInteractiveElement(dom);
            }
        }
        delegatedRoots.items.set(dom, nextEvent);
    } else if (delegatedRoots) {
        if (delegatedRoots.items.has(dom)) {
            delegatedRoots.count--;
            delegatedRoots.items.delete(dom);
            if (delegatedRoots.count === 0) {
                document.removeEventListener(normalizeEventName(name), delegatedRoots.docEvent);
                delegatedEvents.delete(name);
            }
        }
    }
}
function dispatchEvent(event, dom, items, count, eventData) {
    const eventsToTrigger = items.get(dom);
    if (eventsToTrigger) {
        count--;
        eventData.dom = dom;
        if (eventsToTrigger.event) {
            eventsToTrigger.event(eventsToTrigger.data, event);
        } else {
            eventsToTrigger(event);
        }
        if (eventData.stopPropagation) {
            return;
        }
    }
    if (count > 0) {
        const parentDom = dom.parentNode;
        if (parentDom && parentDom.disabled !== true || parentDom === document.body) {
            dispatchEvent(event, parentDom, items, count, eventData);
        }
    }
}
function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
}
function attachEventToDocument(name, delegatedRoots) {
    const docEvent = event => {
        const eventData = {
            stopPropagation: false,
            dom: document
        };
        Object.defineProperty(event, 'currentTarget', {
            configurable: true,
            get() {
                return eventData.dom;
            }
        });
        event.stopPropagation = () => {
            eventData.stopPropagation = true;
        };
        const count = delegatedRoots.count;
        if (count > 0) {
            dispatchEvent(event, event.target, delegatedRoots.items, count, eventData);
        }
    };
    document.addEventListener(normalizeEventName(name), docEvent);
    return docEvent;
}
function emptyFn() {
}
function trapClickOnNonInteractiveElement(dom) {
    dom.onclick = emptyFn;
}
/* fuse:end-file "packages/inferno/src/DOM/events/delegation.js"*/
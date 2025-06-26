import { Provider } from './components/ui/provider';
import { ClickerProvider } from './components/sys/simulation';
import Shell from './components/sys/shell';
import { AudioEngineProvider } from './components/sys/audio/AudioEngine';
import { PlayerProvider } from './components/player/PlayerContext';
import { MarkovChainProvider } from './components/chat/MarkovChain';
import { ResearchDrawerProvider } from './components/research/ResearchDrawerContext';
import { ShopDrawerProvider } from './components/shop/ShopDrawerContext';
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <Provider>
      <Toaster />
      <AudioEngineProvider>
        <PlayerProvider>
          <ClickerProvider>
            <MarkovChainProvider>
              <ResearchDrawerProvider>
                <ShopDrawerProvider>
                  <Shell />
                </ShopDrawerProvider>
              </ResearchDrawerProvider>
            </MarkovChainProvider>
          </ClickerProvider>
        </PlayerProvider>
      </AudioEngineProvider>
    </Provider>
  );
}
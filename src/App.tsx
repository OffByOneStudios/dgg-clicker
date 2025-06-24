import { Provider } from './components/ui/provider';
import { ClickerProvider } from './components/sys/simulation';
import Shell from './components/sys/shell';
import { AudioEngineProvider } from './components/sys/audio/AudioEngine';
import { PlayerProvider } from './components/player/PlayerContext';
import { MarkovChainProvider } from './components/chat/MarkovChain';
import { ResearchDrawerProvider } from './components/research/ResearchDrawerContext';

export default function App() {
  return (
    <Provider>
      <AudioEngineProvider>
        <PlayerProvider>
          <ClickerProvider>
            <MarkovChainProvider>
              <ResearchDrawerProvider>
                <Shell />
              </ResearchDrawerProvider>
            </MarkovChainProvider>
          </ClickerProvider>
        </PlayerProvider>
      </AudioEngineProvider>
    </Provider>
  );
}
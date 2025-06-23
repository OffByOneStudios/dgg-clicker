import { Provider } from './components/ui/provider';
import { ClickerProvider } from './components/sys/simulation';
import Shell from './components/sys/shell';
import { AudioEngineProvider } from './components/sys/audio/AudioEngine';
import { PlayerProvider } from './components/player/PlayerContext';

export default function App() {
  return (
    <Provider>
      <AudioEngineProvider>
        <PlayerProvider>
          <ClickerProvider>
            <Shell />
          </ClickerProvider>
        </PlayerProvider>
      </AudioEngineProvider>
    </Provider>
  );
}
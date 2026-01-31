import { Switch } from 'antd';
import { useColorMode } from '../../hooks/useColorMode';

export default function DarkModeSwitcher() {
  const { colorMode, setColorMode } = useColorMode();

  return (
    <li>
      <Switch
        size="small"
        checked={colorMode === 'dark'}
        onChange={(checked) => setColorMode(checked ? 'dark' : 'light')}
      />
    </li>
  );
}


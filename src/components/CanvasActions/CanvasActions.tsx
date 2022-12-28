import Divider from '@mui/material/Divider';
import Stack from '@mui/system/Stack';
import { MainSection } from '../SectionsRender';

export const canvasActions = () => {
  return (
    <MainSection>
      <Stack direction='column' divider={<Divider orientation="vertical" flexItem />}>
        <div></div>
      </Stack>
    </MainSection>
  );
};

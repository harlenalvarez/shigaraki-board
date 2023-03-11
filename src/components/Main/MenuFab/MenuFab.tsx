import { ReactComponent as SelectIcon } from '@/assets/cursor.svg';
import { ButtonGroup, IconButton } from './MenuFab.styled';
export const MenuFab = () => {
  return (
    <ButtonGroup variant='contained' orientation='vertical' aria-label='Shapes Selection Menu'>
      <IconButton aria-selected='true'>
        <SelectIcon />
      </IconButton>
    </ButtonGroup>
  );
};

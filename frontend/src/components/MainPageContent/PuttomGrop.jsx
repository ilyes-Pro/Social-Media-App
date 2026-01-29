import { SidebarGroup } from '../ui/sidebar';

export default function PuttomGrop({ name, Img, Active, mod, ...rest }) {
  return (
    <SidebarGroup
      className={`group/sidebar flex  ${mod === 'mobile' ? ' flex-col gap-1 !text-xs' : 'flex-row gap-3'} justify-start items-center  !p-3 cursor-pointer  transition rounded-xl ${Active ? (mod === 'mobile' ? 'text-puttom' : 'bg-puttom/15 text-puttom') : 'hover:bg-bg2 text-text'} `}
      {...rest}
    >
      <Img className="group-hover/sidebar:scale-110 transition" />
      <h2>{name}</h2>
    </SidebarGroup>
  );
}

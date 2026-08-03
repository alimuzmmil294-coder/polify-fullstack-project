import {
  LayoutGrid,
  PlusSquare,
  PenSquare,
  CheckCircle2,
  Bookmark,
  Settings,
  LogOut,
  Search,
  Bell,
  List,
  ToggleLeft,
  Star,
  Image as ImageIcon,
  MessageSquare,
  ArrowUp,
  Share2,
  Compass,
  Users,
} from "lucide-react";

const map = {
  grid: LayoutGrid,
  plus: PlusSquare,
  edit: PenSquare,
  check: CheckCircle2,
  bookmark: Bookmark,
  settings: Settings,
  logout: LogOut,
  search: Search,
  bell: Bell,
  list: List,
  toggle: ToggleLeft,
  star: Star,
  image: ImageIcon,
  message: MessageSquare,
  up: ArrowUp,
  share: Share2,
  compass: Compass,
  users: Users,
};

export default function Icon({ name, size = 18, className = "", strokeWidth = 2 }) {
  const Cmp = map[name];
  if (!Cmp) return null;
  return <Cmp size={size} className={className} strokeWidth={strokeWidth} />;
}

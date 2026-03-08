import { useAuth } from '@/contexts/AuthContext';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { FileText, CalendarDays, ClipboardList, Users, LogOut } from 'lucide-react';
import collegeLogo from '@/assets/college-logo.jpg';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const studentItems = [
  { title: 'Apply Leave', url: '/student', icon: FileText },
  { title: 'Leave Calendar', url: '/student/calendar', icon: CalendarDays },
];

const advisorItems = [
  { title: 'Pending Requests', url: '/advisor', icon: ClipboardList },
  { title: 'Student Records', url: '/advisor/records', icon: Users },
];

const AppSidebar = () => {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const items = user?.role === 'student' ? studentItems : advisorItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-3 px-3 py-4">
            <img src={collegeLogo} alt="ESEC" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-bold text-sidebar-foreground leading-tight truncate">ESEC</p>
                <p className="text-[10px] text-sidebar-foreground/70 truncate">{user?.role === 'student' ? 'Student Portal' : 'Advisor Portal'}</p>
              </div>
            )}
          </div>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <Button variant="ghost" onClick={logout} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && 'Logout'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

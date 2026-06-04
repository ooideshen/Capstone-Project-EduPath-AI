'use client';
import { Tabs, Tab } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { Activity, Database, Users, TrendingUp, BookOpen, ShieldAlert } from 'lucide-react';

export default function AdminTab() {
    const router = useRouter();
    const pathname = usePathname();

    const paths = [
        '/admin/overview', 
        '/admin/university',
        '/admin/mqa', 
        '/admin/access-control', 
        '/admin/market-data', 
        '/admin/system-monitor'
    ];

    const value = paths.indexOf(pathname) === -1 ? 0 : paths.indexOf(pathname);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        router.push(paths[newValue]);
    };

    return (
        <Tabs 
            value={value} 
            onChange={handleChange} 
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
                minHeight: 48,
                '& .MuiTabs-indicator': {
                    backgroundColor: '#0062FE',
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                },
                '& .MuiTab-root': { 
                    color: '#64748B', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    fontSize: 14,
                    minHeight: 48,
                    mr: 1,
                    '&.Mui-selected': {
                        color: '#0062FE',
                    },
                    '&:hover': {
                        color: '#1A1A1A',
                    }
                } 
            }}
        >
            <Tab icon={<Activity size={18} />} iconPosition="start" label="Overview" />
            <Tab icon={<BookOpen size={18} />} iconPosition="start" label="University DB" />
            <Tab icon={<Database size={18} />} iconPosition="start" label="MQA Database" />
            <Tab icon={<Users size={18} />} iconPosition="start" label="Access Control" />
            <Tab icon={<TrendingUp size={18} />} iconPosition="start" label="Market Data" />
            <Tab icon={<ShieldAlert size={18} />} iconPosition="start" label="System Monitor" />
        </Tabs>
    );
}
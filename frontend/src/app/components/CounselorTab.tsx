'use client';
import { Tabs, Tab } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, LineChart, Users } from 'lucide-react';

export default function CounselorTab() {
    const router = useRouter();
    const pathname = usePathname();

    const paths = [
        '/counselor/overview', 
        '/counselor/analytics',
        '/counselor/students'
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
            <Tab icon={<LayoutDashboard size={18} />} iconPosition="start" label="Welcome & Overview" />
            <Tab icon={<LineChart size={18} />} iconPosition="start" label="Cohort Analytics" />
            <Tab icon={<Users size={18} />} iconPosition="start" label="Student Directory" />
        </Tabs>
    );
}

'use client';
import { Tabs, Tab } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, GraduationCap, BrainCircuit, FileBarChart, ArrowLeftRight, Bookmark } from 'lucide-react';

export default function StudentTab() {
    const router = useRouter();
    const pathname = usePathname();

    const paths = [
        '/student/overview', 
        '/student/grades', 
        '/student/riasec', 
        '/student/report', 
        '/student/comparison',
        '/student/saved'
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
            <Tab icon={<LayoutDashboard size={18} />} iconPosition="start" label="Overview" />
            <Tab icon={<GraduationCap size={18} />} iconPosition="start" label="Academic Results" />
            <Tab icon={<BrainCircuit size={18} />} iconPosition="start" label="RIASEC Assessment" />
            <Tab icon={<FileBarChart size={18} />} iconPosition="start" label="AI Reality Report" />
            <Tab icon={<ArrowLeftRight size={18} />} iconPosition="start" label="Comparison Matrix" />
            <Tab icon={<Bookmark size={18} />} iconPosition="start" label="Saved Pathways" />
        </Tabs>
    );
}

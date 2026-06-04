import { Stack, Typography } from '@mui/material';

interface PageHeaderProps {
  title: string;
  description: string;
  iconSrc: string;
}

export default function PageHeader({ title, description, iconSrc }: PageHeaderProps) {
  return (
    <Stack sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img 
          src={iconSrc}
          alt="Icon"
          width={32}
          height={32}
          style={{ objectFit: 'contain' }}
        /> 
        {title}
      </Typography>
      <Typography color="grey.500">{description}</Typography>
    </Stack>
  );
}
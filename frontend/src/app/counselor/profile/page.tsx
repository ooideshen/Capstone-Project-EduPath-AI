"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";

export default function CounselorProfilePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        color: "white",
        p: 5,
      }}
    >
      <Typography variant="h3" fontWeight="bold" mb={4}>
        Institution Profile
      </Typography>

      <Card
        sx={{
          maxWidth: 700,
          backgroundColor: "#111",
          color: "white",
          borderRadius: 4,
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            label="School Name"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ style: { color: "gray" } }}
            sx={{
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "gray" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Counselor Name"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ style: { color: "gray" } }}
            sx={{
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "gray" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            InputLabelProps={{ style: { color: "gray" } }}
            sx={{
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "gray" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Institution Address"
            multiline
            rows={4}
            variant="outlined"
            margin="normal"
            InputLabelProps={{ style: { color: "gray" } }}
            sx={{
              textarea: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "gray" },
              },
            }}
          />

          <Button
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#9333ea",
            }}
          >
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
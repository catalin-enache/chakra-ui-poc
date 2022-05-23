
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "../Dashboard";
import { FormOne } from "../FormOne";
import { FormTwo } from "../FormTwo";
import { Box } from "@chakra-ui/react";

export const MainContent = () => {
  return (
    <Box textAlign="left" pl={4}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/form-one" element={<FormOne />} />
        <Route path="/form-two" element={<FormTwo />} />
      </Routes>
    </Box>
  );
}

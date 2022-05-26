
import { Link } from "react-router-dom";
import { Flex, chakra } from "@chakra-ui/react";

export const LeftSidebar = () => {
  return (
    <Flex textAlign="left" >
      <chakra.ul pl={2}>
        <chakra.li textStyle="textSm"><Link to="/">Dashboard</Link></chakra.li>
        <chakra.li textStyle="textSm"><Link to="/form-one">Form One</Link></chakra.li>
        <chakra.li textStyle="textSm"><Link to="/form-two">Form Two</Link></chakra.li>
      </chakra.ul>
    </Flex>
  );
}

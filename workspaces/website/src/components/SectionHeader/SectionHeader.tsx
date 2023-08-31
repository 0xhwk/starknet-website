import { Box, Stack, Divider } from "@chakra-ui/react";
import { Text } from "@ui/Typography/Text";
import { Heading } from "@ui/Typography/Heading";

import React from "react";

type Props = {
  title: string | undefined;
  description?: string | undefined;
  bottomContent?: React.ReactNode;
  size?: "sm" | "lg";
};

export const SectionHeader = ({
  size = "sm",
  title,
  description,
  bottomContent,
}: Props) => {
  return (
    <Box
      as="section"
      borderBottom="1px solid"
      borderColor="border.divider"
      pb={{
        base: "page.block-gap.base",
        md: "page.block-gap.md",
        lg: "2xl",
      }}
      mb="40px"
      // pt={{ base: "4", md: "8" }} pb={{ base: "12", md: "12" }}
    >
      <Stack spacing="40px">
        <Box>
          <Heading
            variant="h1"
            as="h2"
            // fontSize={{ base: "32px", md: "48px" }}
            // lineHeight={{ base: "1.5em", md: "1.5em" }}
            fontWeight="extrabold"
            color="heading-navy-fg"
          >
            {title}
          </Heading>
          {description && (
            <Text
              color="content.accent.value"
              variant="body"
              pt={size === "sm" ? "xs" : "lg"}
            >
              {description}
            </Text>
          )}
          {bottomContent}
        </Box>
      </Stack>
    </Box>
  );
};

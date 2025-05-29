import React from 'react';
import { Text, Container, Button, Section, Heading, Tailwind, Html } from "@react-email/components";


interface EmailTemplateProps {
  email: string;
}

export function EmailTemplate({ email }: EmailTemplateProps) {
  return (
    <>
    <Html lang="en">
      <Tailwind>
        <Section className="bg-[#fdf9ee] text-[#2d1d1a] font-sans p-6 rounded-lg max-w-3xl mx-auto height-full">
          <Container className="max-w-xl mx-auto">
            <Heading className="text-2xl font-bold mb-4">Welcome to Tempo, {email}!</Heading>
            <Text className="text-base mb-6">
              Thank you for subscribing to our newsletter. We’re excited to have you as part of the Tempo community!
            </Text>
            <Button
              href="https://your-tempo-site.com"
              className="bg-[#2d1d1a] text-white px-6 py-4 text-sm w-full max-w-[225px] font-semibold rounded-full"
            >
              Find your tempo!
            </Button>
          </Container>
        </Section>
      </Tailwind>
    </Html>
    </>
  );
}
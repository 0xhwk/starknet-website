
/**
 * Module dependencies.
 */

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast
} from "@chakra-ui/react";

import { PageLayout } from "@ui/Layout/PageLayout";
import { SEOTexts } from "@starknet-io/cms-data/src/seo";
import { Text } from '@ui/Typography/Text';
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
import axios from "axios";
import qs from "qs";

/**
 * `Props` type.
 */

export interface Props {
  readonly env: {
    readonly CLOUDFLARE_RECAPTCHA_KEY: string;
  };
  readonly seo: SEOTexts['newsletter'];
}

/**
 * Export `NewsletterPage` component.
 */

export function NewsletterPage({ env, seo }: Props): JSX.Element | null {
  const toast = useToast();
  const [formState, setFormState] = useState<'submitting' | 'success' | null>(null);
  const captchaRef = useRef<TurnstileInstance | undefined>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState('submitting');

    try {
      const token = captchaRef.current?.getResponse();

      await axios.post(`/api/newsletter-subscribe?${qs.stringify({
        email: (event.target as any)[0].value,
        token,
      })}`)

      captchaRef.current?.reset();
      setFormState('success');
    } catch (error: any) {
      setFormState(null);
      captchaRef.current?.reset();
      
      const toastErrorConfig = {
        duration: 1500,
        isClosable: true,
        status: 'error' as 'error',
      };

      if(error.response.data?.title === 'Invalid Captcha') {
        toast({
          description: 'We\'re having trouble verifying you\'re a human. Please try again.',
          ...toastErrorConfig
        });

        return;
      }

      if(error.response.data?.title === 'Member Exists') {
        toast({
          description: 'You are already subscribed to the newsletter.',
          ...toastErrorConfig
        });

        return;
      }

      toast({
        description: 'There was an issue subscribing you to the newsletter.',
        ...toastErrorConfig
      });
    }
  }

  return (
    <PageLayout
      sectionHeaderTitle={seo.title}
      sectionHeaderDescription={seo.subtitle}
      main={
        <Box maxW={500}>
          {formState !== 'success' ? (
            <form onSubmit={handleSubmit}>
              <FormControl isRequired paddingBottom={'20px'}>
                <FormLabel fontWeight={'700'}>
                  Email
                </FormLabel>

                <Input
                  type={'email'}
                  name={'email'}
                  id={'email'}
                  placeholder={'Please enter your email'}
                />
              </FormControl>

              <Turnstile
                options={{
                  size: 'invisible'
                }}
                ref={captchaRef}
                siteKey={env.CLOUDFLARE_RECAPTCHA_KEY}
              />

              <Button
                fontSize={'14px'}
                isLoading={formState === 'submitting'}
                padding={'6px 16px'}
                type={'submit'}
                variant={'solid'}
              >
                Submit
              </Button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Text 
                variant={'cardBody'}
                color={'heading-navy-fg'}
              >
                Thank you and may the STARK be with you ✨🗞️
              </Text>
            </div>
          )}
        </Box>
      }
    />
  )
};

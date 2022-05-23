import React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
  chakra, VStack
} from '@chakra-ui/react';

const schema = z.object({
  name: z.string()
    .min(4, { message: 'Must be at least 4 chars' })
    .regex(/^[A-Za-z]+$/, {message: 'Only A-Za-z chars'}),
  email: z.string().email('Invalid email').refine(async (email) => new Promise((res) => {
    console.log('server call to check email each time a field is changed?');
    // can we at least know if the email changed (old value vs new value ?) to skip the server call ?
    setTimeout(() => {
      email === 'g@g.gg' ? res(false) : res(true);
    }, 1000)
  }), { message: 'Email is taken :(' }),
  country: z.string().min(1, { message: 'Country is required' }),
  password: z.string()
    .min(4, { message: 'Must be at least 4 chars' })
    .regex(/\d+/, {message: 'Must contain at least one number'}),
  passwordConfirm: z.string().min(1, { message: 'Required' })
}).refine((data) => {
  console.log('refine', data.password, data.passwordConfirm);
  return data.password === data.passwordConfirm;
}, {
  // here we have a bug: passwordConfirm does not re-validate when password changes
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});


export function FormOne() {
  const defaultValues = {
    name: "zz",
    email: "",
    country: "",
    password: '',
    passwordConfirm: '',
  };

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid, isSubmitted, isValidating },
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit((values) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2))
        resolve('');
      }, 500)
    })
  });

  console.log({ errors });

  return (
    <chakra.form onSubmit={onSubmit}>
      <VStack spacing={8} alignItems="flex-start">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel htmlFor='name'>First name</FormLabel>
          <Input
            id='name'
            placeholder='name'
            {...register('name')}
          />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <Input
            id='email'
            placeholder='email'
            {...register('email')}
          />
          <FormErrorMessage>
            {errors.email && errors.email.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.country}>
          <FormLabel htmlFor='country'>Select Country</FormLabel>
          <Select placeholder='Select a country' id='country'
                  {...register('country')}
          >
            <option value='UK'>UK</option>
            <option value='USA'>USA</option>
            <option value='France'>France</option>
          </Select>
          <FormErrorMessage>
            {!!errors.country && errors.country.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input
            id='password'
            placeholder='password'
            type="password"
            {...register('password')}
          />
          <FormErrorMessage>
            {!!errors.password && errors.password.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.passwordConfirm}>
          <FormLabel htmlFor='passwordConfirm'>Confirm Password</FormLabel>
          <Input
            id='passwordConfirm'
            placeholder='password'
            type="password"
            {...register('passwordConfirm')}
          />
          <FormErrorMessage>
            {!!errors.passwordConfirm && errors.passwordConfirm.message}
          </FormErrorMessage>
        </FormControl>
        <chakra.p>{isValidating ? 'isValidating' : ' '}</chakra.p>
        <Button mt={4} colorScheme='teal' isLoading={isSubmitting} isDisabled={isSubmitted && (!isValid || isValidating)} type='submit'>
          Submit
        </Button>
      </VStack>
    </chakra.form>
  )
}

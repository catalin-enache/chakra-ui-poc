import React, {useCallback, useState} from "react";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Select,
  chakra,
  VStack,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react';
import { PhoneIcon } from '@chakra-ui/icons'
import { InputWithDebounce } from "../InputWithDebounce";
import { InputSearchTerms } from "../InputSearchTerms";
import { InputSearchTermsBis } from "../InputSearchTermsBis";
import { getOptions, Options } from "../../services/options.api";

const emailsCache: Record<string, boolean> = {};

const schema = z.object({
  name: z.string()
    .min(4, { message: 'Must be at least 4 chars' })
    .regex(/^[A-Za-z]+$/, {message: 'Only A-Za-z chars'}),
  email: z.string().email('Invalid email').refine(async (email) =>
    emailsCache[email] !== undefined ? Promise.resolve(emailsCache[email]) : new Promise((res) => {
      // console.log('server call to check email each time a field is changed?'); // prints at each change for any field
      // can we at least know (from zod API) if the email changed (old value vs new value ?) to skip the server call ?
      // else we might need to externally cache it in a Map in order to skip the server call
      setTimeout(() => {
        const isTaken = email === 'g@g.gg';
        emailsCache[email] = !isTaken;
        isTaken ? res(false) : res(true);
      }, 1000)
    }), { message: 'Email is taken :(' }),
  tags: z.string().min(1, { message: 'Required' }),
  tagsBis: z.string().min(1, { message: 'Required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  password: z.string()
    .min(4, { message: 'Must be at least 4 chars' })
    .regex(/\d+/, {message: 'Must contain at least one number'}),
  passwordConfirm: z.string().min(1, { message: 'Required' })
}).refine((data) => {
  console.log('refine', data.password, data.passwordConfirm);
  return data.password === data.passwordConfirm;
}, {
  // here we have a bug ?? passwordConfirm does not re-validate when password changes
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});


export function FormOne() {
  const defaultValues = {
    name: "zz",
    tags: "two",
    tagsBis: "two",
    email: "",
    country: "",
    password: '',
    passwordConfirm: '',
  };

  const {
    handleSubmit,
    register,
    control,
    watch,
    getValues,
    formState: { errors, isSubmitting, isValid, isSubmitted, isValidating },
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUseNativeValidation: false,
    resolver: zodResolver(schema)
  });

  const [options, setOptions] = useState<Options>({});

  const tagsValue = watch('tags');
  const formValues = getValues();

  const onSubmit = handleSubmit((values) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(JSON.stringify(values, null, 2))
        resolve('');
      }, 500)
    })
  });

  const handleSearch = useCallback((evt: React.ChangeEvent<HTMLInputElement> | string) => {
    getOptions(typeof evt === 'string' ? evt : evt.target.value).then(setOptions)
  }, []);

  console.log({ tagsValue, errors, formValues });

  return (
    <chakra.form onSubmit={onSubmit} p={10}>
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


        <FormControl isInvalid={!!errors.tags}>
          <FormLabel htmlFor='tags'>Tags</FormLabel>
          <InputSearchTerms
            options={options}
            onSearch={handleSearch}
            delay={1000}
            id='tags'
            placeholder='tags'
            {...register('tags')}
          />
          <FormErrorMessage>
            {errors.tags && errors.tags.message}
          </FormErrorMessage>
        </FormControl>


        <FormControl isInvalid={!!errors.tagsBis}>
          <FormLabel htmlFor='tagsBis'>Tags Bis</FormLabel>
          <Controller
            control={control}
            name="tagsBis"
            render={({ field }) => <InputSearchTermsBis
              options={options}
              onSearch={handleSearch}
              delay={1000}
              id='tagsBis'
              placeholder='tags'
              {...field}
            />}
          />
          <FormErrorMessage>
            {errors.tags && errors.tags.message}
          </FormErrorMessage>
        </FormControl>


        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <InputGroup>
            <InputLeftAddon children={<PhoneIcon />} />
            <InputWithDebounce
              delay={1000}
              id='email'
              placeholder='email'
              {...register('email')}
            />
          </InputGroup>

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

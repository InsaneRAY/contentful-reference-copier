import React, { useMemo, useCallback, useReducer } from 'react';
import { PlainClientAPI } from 'contentful-management';
import { SidebarExtensionSDK } from '@contentful/app-sdk';
import { Form, FieldGroup, Select, Option, Button, FormLabel } from '@contentful/forma-36-react-components';

interface SidebarProps {
  sdk: SidebarExtensionSDK;
  cma: PlainClientAPI;
}

interface FormValues {
  field: string;
  sourceLocale: string;
  targetLocale: string;
}

const initialFormValues = {
  field: '',
  sourceLocale: '',
  targetLocale: ''
}

const formReducer = (formValues: FormValues, action: { name: string; value: string; }): FormValues => {
  const { name, value } = action;

  return {
    ...formValues,
    [name]: value
  }
}

const Sidebar = ({ sdk, cma }: SidebarProps) => {
  const [{ field: activeField, targetLocale, sourceLocale }, dispatch] = useReducer(formReducer, initialFormValues);
  const fields = useMemo(() => {
    const entryFields = sdk.entry.fields;

    return Object.keys(entryFields).filter(field => entryFields[field].type === 'Array')
  }, [sdk]);

  const locales = sdk.locales.available;
  // const defaultLocale = sdk.locales.default;
  const handleCopy = useCallback((values) => {
    console.log(values);
  }, []);

  const handleFormValueChange = useCallback((e: InputEvent) => {
    const { name, value } = e.target;

    dispatch({
      name,
      value
    });
  }, [dispatch]);

  return (
    <>
      <Form onSubmit={handleCopy} spacing="condensed">
        <FieldGroup>
          <FormLabel htmlFor="name">Field</FormLabel>
          <Select name="field" onChange={handleFormValueChange}>
            { fields.map(field => (
              <Option value={field} key={field} selected={field === activeField }>
                { field }
              </Option>
            )) }
          </Select>
        </FieldGroup>
        <FieldGroup>
          <FormLabel htmlFor="name">Source Locale</FormLabel>
          <Select name="field">
            { locales.map(locale => (
              <Option value={locale} key={locale} selected={locale === sourceLocale}>
                { locale }
              </Option>
            )) }
          </Select>
        </FieldGroup>
        <FieldGroup>
          <FormLabel htmlFor="name">Target Locale</FormLabel>
          <Select name="field">
            { locales.map(locale => (
              <Option value={locale} key={locale} selected={locale === targetLocale}>
                { locale }
              </Option>
            )) }
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Button type="submit">Copy</Button>
        </FieldGroup>
      </Form>
    </>
  );
};

export default Sidebar;

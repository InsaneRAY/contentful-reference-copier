import React, { useMemo, useCallback } from 'react';
import { useFormik } from 'formik';
import { PlainClientAPI } from 'contentful-management';
import { SidebarExtensionSDK } from '@contentful/app-sdk';
import { Form, FieldGroup, Select, Option, Button, FormLabel } from '@contentful/forma-36-react-components';

interface SidebarProps {
  sdk: SidebarExtensionSDK;
  cma: PlainClientAPI;
}

const initialFormValues = {
  field: '',
  sourceLocale: '',
  targetLocale: ''
}

const withPlaceholderOption = (target: string[]) => {
  return [''].concat(target);
}

const Sidebar = ({ sdk, cma }: SidebarProps) => {
  const fields = useMemo(() => {
    const entryFields = sdk.entry.fields;

    return withPlaceholderOption(Object.keys(entryFields).filter(field => entryFields[field].type === 'Array'));
  }, [sdk]);

  const locales = withPlaceholderOption(sdk.locales.available);

  // const defaultLocale = sdk.locales.default;
  const handleCopy = useCallback(({
    field,
    sourceLocale,
    targetLocale,
  }) => {
    const fieldRef = sdk.entry.fields[field];
    fieldRef.setValue(fieldRef.getValue(sourceLocale), targetLocale);
  }, []);

  const {
    handleChange,
    values: {
      field: activeField,
      targetLocale,
      sourceLocale
    },
    handleSubmit,
    resetForm
  } = useFormik({
    initialValues: initialFormValues,
    onSubmit: handleCopy
  });

  return (
    <>
      <Form onSubmit={handleSubmit} spacing="condensed">
        <FieldGroup>
          <FormLabel htmlFor="field">Field</FormLabel>
          <Select
            name="field"
            id="field"
            onChange={handleChange}
            value={activeField}
          >
            { fields.map(field => (
              <Option value={field} key={field}>
                { field }
              </Option>
            )) }
          </Select>
        </FieldGroup>
        <FieldGroup>
          <FormLabel htmlFor="sourceLocale">Source Locale</FormLabel>
          <Select
            name="sourceLocale"
            id="sourceLocale"
            onChange={handleChange}
            value={sourceLocale}
          >
            { locales.map(locale => (
              <Option value={locale} key={locale}>
                { locale }
              </Option>
            )) }
          </Select>
        </FieldGroup>
        <FieldGroup>
          <FormLabel htmlFor="targetLocale">Target Locale</FormLabel>
          <Select
            name="targetLocale"
            id="targetLocale"
            onChange={handleChange}
            value={targetLocale}
          >
            { locales.map(locale => (
              <Option value={locale} key={locale}>
                { locale }
              </Option>
            )) }
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Button type="submit"> Copy </Button>
        </FieldGroup>
      </Form>
    </>
  );
};

export default Sidebar;

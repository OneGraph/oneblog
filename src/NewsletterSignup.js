// @flow

import React from 'react';
import idx from 'idx';
import {Box, Heading, Form, FormField, Button, TextInput, Text} from 'grommet';

// Create your own signup from the Persisted Queries tab on OneGraph
// 1. create a token with mailchimp auth from the "Server-side Auth" tab.
// 2. enter the query into the form and change the list id in the path param
// 3. set free variables to email, firstName, and lastName
// 4. replace the doc_id below
// 5. Set RAZZLE_ENABLE_MAILCHIMP_SIGNUP=true in .env
const DOC_ID = 'd0b9c4f6-73b4-400c-b003-1692b67e12ca';
/* 
# Query for d0b9c4f6-73b4-400c-b003-1692b67e12ca
mutation MailchimpSignup($email: String!, $firstName: String!, $lastName: String!) {
  mailchimp {
    makeRestCall {
      post(
        path: "/3.0/lists/e6680e715f/members"
        jsonBody: {
          email_address: $email
          status: "pending"
          tags: ["changelog"]
          merge_fields: {
            FNAME: $firstName
            LNAME: $lastName
          }
        }
      ) {
        jsonBody
      }
    }
  }
}
 */

async function subscribeToList({
  email,
  firstName,
  lastName,
}: {
  email: string,
  firstName: string,
  lastName: string,
}): Promise<any> {
  const resp = await fetch(
    'https://serve.onegraph.com/graphql?app_id=' +
      String(process.env.RAZZLE_ONEGRAPH_APP_ID),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        doc_id: DOC_ID,
        variables: {
          email,
          firstName,
          lastName,
        },
      }),
    },
  );
  const json = await resp.json();
  const body = idx(json, _ => _.data.mailchimp.makeRestCall.post.jsonBody);
  if (!body) {
    throw new Error('unknown error');
  }
  if (body.email_address) {
    return;
  }
  const errors = idx(
    json,
    _ => _.data.mailchimp.makeRestCall.post.jsonBody.errors,
  );

  if (errors) {
    if (errors.find(e => e.field === 'email_address')) {
      throw new Error('invalid email');
    } else {
      throw new Error('unknown error');
    }
  }

  const errorDetail = body.detail;
  if (errorDetail) {
    throw new Error(errorDetail);
  }
}

export default function NewsletterSignup() {
  const [formFields, setFormFields] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  if (success) {
    return (
      <Box pad="medium" elevation="small">
        <Heading level={4} margin="none">
          Subscribed to updates!
        </Heading>
        <Text margin={{top: 'small'}} size="small">
          Check your email for the confirmation.
        </Text>
      </Box>
    );
  }
  return (
    <Box pad="medium" elevation="small">
      <Heading level={4} margin="none">
        Subscribe to updates
      </Heading>
      <Box margin={{top: 'small'}}>
        <Form
          errors={error ? {email: error} : {}}
          value={formFields}
          onSubmit={async e => {
            e.stopPropagation();
            e.preventDefault();
            setIsLoading(true);
            setError(null);
            try {
              await subscribeToList(formFields);
              setSuccess(true);
            } catch (e) {
              setError(
                `Error subscribing: ${e.message} 
                Email sayhi@onegraph.com for help.`,
              );
              console.error('Error subscribing', e);
            } finally {
              setIsLoading(false);
            }
          }}>
          <FormField name="firstName˚">
            <TextInput
              disabled={isLoading}
              value={formFields.firstName}
              onChange={e =>
                setFormFields({
                  ...formFields,
                  firstName: e.target.value,
                })
              }
              placeholder="First name"
            />
          </FormField>
          <FormField name="lastName">
            <TextInput
              disabled={isLoading}
              value={formFields.lastName}
              onChange={e =>
                setFormFields({
                  ...formFields,
                  lastName: e.target.value,
                })
              }
              placeholder="Last name"
            />
          </FormField>
          <FormField name="email">
            <TextInput
              disabled={isLoading}
              value={formFields.email}
              onChange={e =>
                setFormFields({
                  ...formFields,
                  email: e.target.value,
                })
              }
              placeholder="Email"
            />
          </FormField>
          <Button disabled={isLoading} type="submit" label="Subscribe" />
        </Form>
      </Box>
    </Box>
  );
}

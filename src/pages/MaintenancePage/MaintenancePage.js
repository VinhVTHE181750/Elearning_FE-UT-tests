import React from 'react';
import { Button, Result } from 'antd';

export default function MaintenancePage() {
  return (
    <Result
      status="warning"
      title="Sorry, the site is under maintenance. Please come back later."
      extra={
        <Button type="primary" key="console">
          Go Console
        </Button>
      }
    />
  );
}

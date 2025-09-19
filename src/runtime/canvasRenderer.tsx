import React from 'react';
import { UiNode } from './types';
import {
  Card,
  Heading,
  Text,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
  FormField,
  TextInput,
  Select,
  Table,
  StatusIndicator,
  Banner,
  Toast,
  Tabs,
  SystemIcon,
  AccentIcon,
  AppletIcon,
  Breadcrumbs,
} from '@workday/canvas-kit-react';
import { Avatar } from '@workday/canvas-kit-preview-react';

// Import icon assets
import * as systemIcons from '@workday/canvas-system-icons-web';
import * as accentIcons from '@workday/canvas-accent-icons-web';
import * as appletIcons from '@workday/canvas-applet-icons-web';

export const renderCanvasUi = (node: UiNode): React.ReactNode => {
  return <CanvasRenderNode key={Math.random()} node={node} />;
};

interface RenderUiProps {
  node: UiNode;
}

const CanvasRenderNode: React.FC<RenderUiProps> = ({ node }) => {
  const { type, props = {}, children = [] } = node;

  const renderChildren = (spacing = '16px') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {children.map((child, i) => (
        <CanvasRenderNode key={i} node={child} />
      ))}
    </div>
  );


  const renderSmartChildren = (spacing = '16px') => {
    // If we have multiple buttons, render them inline with proper spacing
    const buttonChildren = children.filter(child => child.type === 'Button');
    const nonButtonChildren = children.filter(child => child.type !== 'Button');

    if (buttonChildren.length > 1) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
          {nonButtonChildren.map((child, i) => (
            <CanvasRenderNode key={`non-btn-${i}`} node={child} />
          ))}
          {buttonChildren.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {buttonChildren.map((child, i) => (
                <CanvasRenderNode key={`btn-${i}`} node={child} />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Default behavior for non-button groups
    return renderChildren(spacing);
  };

  switch (type) {
    case 'Page':
      return (
        <div style={{ padding: '24px', backgroundColor: '#f5f7fa' }}>
          {renderChildren('24px')}
        </div>
      );

    case 'Header':
      return (
        <div>
          <Heading size="large" style={{ marginBottom: '16px' }}>
            {props.title || 'Page Title'}
          </Heading>
          {renderChildren('12px')}
        </div>
      );

    case 'Section':
      return (
        <Card>
          <Card.Body>
            {props.title && (
              <Heading size="small" as="h3" style={{ marginBottom: '16px' }}>
                {props.title}
              </Heading>
            )}
            {renderSmartChildren('16px')}
          </Card.Body>
        </Card>
      );

    case 'Card':
      return (
        <Card>
          {props.title && (
            <Card.Heading>
              <Heading size="small">{props.title}</Heading>
            </Card.Heading>
          )}
          <Card.Body>{renderSmartChildren('16px')}</Card.Body>
        </Card>
      );

    case 'Text':
      return (
        <Text>
          {props.content || props.children || renderChildren() || 'Text'}
        </Text>
      );

    case 'Button':
      const ButtonComponent =
        props.variant === 'primary'
          ? PrimaryButton
          : props.variant === 'secondary'
          ? SecondaryButton
          : TertiaryButton;

      return (
        <ButtonComponent>
          {props.text || props.children || 'Button'}
        </ButtonComponent>
      );

    case 'Form':
      return (
        <form>
          {renderSmartChildren('16px')}
        </form>
      );

    case 'Field':
      if (props.type === 'select' && props.options) {
        return (
          <FormField label={props.label}>
            <Select name={props.name || 'select'}>
              <Select.Option value="">Choose an option</Select.Option>
              {props.options.map((opt: string, i: number) => (
                <Select.Option key={i} value={opt}>
                  {opt}
                </Select.Option>
              ))}
            </Select>
          </FormField>
        );
      }

      return (
        <FormField label={props.label}>
          <TextInput
            type={props.type || 'text'}
            placeholder={props.placeholder}
            value={props.value || ''}
            onChange={() => {}}
          />
        </FormField>
      );

    case 'Table':
      return (
        <Table>
          <Table.Head>
            <Table.Row>
              {(props.columns || []).map((col: string, i: number) => (
                <Table.Header key={i}>{col}</Table.Header>
              ))}
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {(props.rows || []).map((row: any, i: number) => (
              <Table.Row key={i}>
                {(props.columns || []).map((col: string, j: number) => {
                  const cellValue = row[col];
                  // If cell contains a UiNode object, render it through CanvasRenderNode
                  if (cellValue && typeof cellValue === 'object' && cellValue.type) {
                    return (
                      <Table.Cell key={j}>
                        <CanvasRenderNode node={cellValue} />
                      </Table.Cell>
                    );
                  }
                  // Otherwise render as string
                  return <Table.Cell key={j}>{cellValue || ''}</Table.Cell>;
                })}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      );

    case 'Badge':
      const getStatusVariant = () => {
        switch (props.status) {
          case 'Active':
            return undefined; // Default/green variant
          case 'On Leave':
            return 'orange';
          case 'Terminated':
            return 'blue'; // Using blue for terminated status
          default:
            return undefined; // Default variant
        }
      };

      const variant = getStatusVariant();

      return (
        <StatusIndicator {...(variant && { variant })}>
          <StatusIndicator.Label>
            {props.status || props.text || props.children || 'Badge'}
          </StatusIndicator.Label>
        </StatusIndicator>
      );

    case 'Icon':
      // Determine icon type and name
      const iconParts = (props.icon || '').split('.');
      const iconType = iconParts[0] || 'system';
      const iconName = iconParts[1] || 'userIcon';

      if (iconType === 'accent') {
        const AccentIconAsset = (accentIcons as any)[iconName];
        return AccentIconAsset ? <AccentIcon icon={AccentIconAsset} /> : null;
      } else if (iconType === 'applet') {
        const AppletIconAsset = (appletIcons as any)[iconName];
        return AppletIconAsset ? <AppletIcon icon={AppletIconAsset} /> : null;
      } else {
        const SystemIconAsset = (systemIcons as any)[iconName];
        return SystemIconAsset ? <SystemIcon icon={SystemIconAsset} /> : null;
      }

    case 'Avatar':
      return (
        <Avatar
          size={props.size || 'medium'}
          variant={props.variant || 'light'}
        >
          {props.name ? props.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
      );

    case 'Tabs':
      const tabItems = children.filter(child => child.type === 'Tab');
      return (
        <Tabs>
          <Tabs.List>
            {tabItems.map((tab, i) => (
              <Tabs.Item key={i}>{tab.props?.label || `Tab ${i + 1}`}</Tabs.Item>
            ))}
          </Tabs.List>
          {tabItems.map((tab, i) => (
            <Tabs.Panel key={i}>
              {tab.children?.map((child, j) => (
                <CanvasRenderNode key={j} node={child} />
              ))}
            </Tabs.Panel>
          ))}
        </Tabs>
      );

    case 'Tab':
      // Individual tabs are handled by the Tabs component
      return null;

    case 'Banner':
      return (
        <Banner variant={props.variant || 'full'}>
          <Banner.Icon />
          <Banner.Label>{props.message || 'Banner message'}</Banner.Label>
        </Banner>
      );

    case 'Toast':
      return (
        <Toast>
          <Toast.Icon />
          <Toast.Message>{props.message || 'Toast message'}</Toast.Message>
        </Toast>
      );

    case 'Modal':
      // Note: Modal requires more complex state management
      // This is a simplified version
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Card>
            <Card.Heading>
              <Heading size="small">{props.title || 'Modal'}</Heading>
            </Card.Heading>
            <Card.Body>{renderChildren()}</Card.Body>
          </Card>
        </div>
      );

    case 'Breadcrumbs':
      const items = props.items || ['Home', 'Page'];
      return (
        <Breadcrumbs aria-label="Breadcrumb">
          <Breadcrumbs.List>
            {items.map((item: string, i: number) => (
              <Breadcrumbs.Item key={i}>
                <Breadcrumbs.Link href="#">{item}</Breadcrumbs.Link>
              </Breadcrumbs.Item>
            ))}
            <Breadcrumbs.CurrentItem>Current Page</Breadcrumbs.CurrentItem>
          </Breadcrumbs.List>
        </Breadcrumbs>
      );

    default:
      return (
        <Text>
          <em style={{ color: '#6b6b6b' }}>Unknown component: {type}</em>
        </Text>
      );
  }
};
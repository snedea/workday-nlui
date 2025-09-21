import React from 'react';
import { UiNode } from './types';
import { DraggableWrapper } from '../components/DraggableWrapper';
import {
  Card,
  Heading,
  Text,
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
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
  Checkbox,
  Radio,
  Switch,
  TextArea,
  Tooltip,
  Menu,
  Pagination,
} from '@workday/canvas-kit-react';
import { Avatar, ColorPicker, SegmentedControl } from '@workday/canvas-kit-preview-react';

// Import icon assets
import * as systemIcons from '@workday/canvas-system-icons-web';
import * as accentIcons from '@workday/canvas-accent-icons-web';
import * as appletIcons from '@workday/canvas-applet-icons-web';

// Helper function to detect if a string is an image URL
const isImageURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;

  // Enhanced image URL detection for badges and various image services
  const imageUrlPattern = /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
  const imageDomainPatterns = [
    'images.credly.com',
    'upload.wikimedia.org',
    'via.placeholder.com',
    'badgelibraryprovider',
    'scrumalliance.org/images',
    'hawaii.edu',
    '/images/',
    '/badge',
    'cdn.',
    'amazonaws.com'
  ];

  const isImageUrl = imageUrlPattern.test(url) ||
    imageDomainPatterns.some(pattern => url.includes(pattern)) ||
    (url.startsWith('http') && url.toLowerCase().includes('image')) ||
    (url.includes('images.credly.com') && url.endsWith('/blob'));

  return isImageUrl;
};

export const renderCanvasUi = (
  node: UiNode,
  isDraggableMode = false,
  onPositionChange?: (id: string, position: { x: number; y: number }) => void,
  onZIndexChange?: (id: string, zIndex: number) => void,
  onCollisionDetected?: (draggedId: string, newPos: { x: number; y: number }, bounds: DOMRect) => void
): React.ReactNode => {
  return (
    <CanvasRenderNode
      key={node.id || Math.random()}
      node={node}
      isDraggableMode={isDraggableMode}
      onPositionChange={onPositionChange}
      onZIndexChange={onZIndexChange}
      onCollisionDetected={onCollisionDetected}
    />
  );
};

interface RenderUiProps {
  node: UiNode;
  isDraggableMode?: boolean;
  onPositionChange?: (id: string, position: { x: number; y: number }) => void;
  onZIndexChange?: (id: string, zIndex: number) => void;
  onCollisionDetected?: (draggedId: string, newPos: { x: number; y: number }, bounds: DOMRect) => void;
}

const CanvasRenderNode: React.FC<RenderUiProps> = ({ node, isDraggableMode = false, onPositionChange, onZIndexChange, onCollisionDetected }) => {
  const { type, props = {}, children = [], position, id, zIndex } = node;

  const renderChildren = (spacing = '16px') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing }}>
      {children.map((child, i) => (
        <CanvasRenderNode
          key={child.id || i}
          node={child}
          isDraggableMode={isDraggableMode}
          onPositionChange={onPositionChange}
          onZIndexChange={onZIndexChange}
          onCollisionDetected={onCollisionDetected}
        />
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
            <CanvasRenderNode
              key={child.id || `non-btn-${i}`}
              node={child}
              isDraggableMode={isDraggableMode}
              onPositionChange={onPositionChange}
              onZIndexChange={onZIndexChange}
              onCollisionDetected={onCollisionDetected}
            />
          ))}
          {buttonChildren.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {buttonChildren.map((child, i) => (
                <CanvasRenderNode
                  key={child.id || `btn-${i}`}
                  node={child}
                  isDraggableMode={isDraggableMode}
                  onPositionChange={onPositionChange}
                  onZIndexChange={onZIndexChange}
                  onCollisionDetected={onCollisionDetected}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Default behavior for non-button groups
    return renderChildren(spacing);
  };

  // Helper function to determine if a component should be draggable
  const isDraggableComponent = (componentType: string) => {
    // Don't make containers draggable - only individual components
    const nonDraggableTypes = ['Page', 'Tab', 'Form', 'Section'];
    return !nonDraggableTypes.includes(componentType);
  };

  // Helper function to wrap component with DraggableWrapper if needed, or apply position in static mode
  const maybeWrapWithDraggable = (component: React.ReactNode) => {
    if (isDraggableComponent(type) && id) {
      if (isDraggableMode) {
        // Draggable mode: always wrap with DraggableWrapper (even if no position yet)
        return (
          <DraggableWrapper
            componentId={id}
            position={position || { x: 0, y: 0 }}
            onPositionChange={onPositionChange}
            isDraggableMode={isDraggableMode}
            zIndex={zIndex || 1}
            onZIndexChange={onZIndexChange}
            onCollisionDetected={onCollisionDetected}
          >
            {component}
          </DraggableWrapper>
        );
      } else if (position) {
        // Static mode: only apply position if it exists
        return (
          <div
            style={{
              position: 'absolute',
              left: position.x,
              top: position.y,
              display: 'inline-block'
            }}
          >
            {component}
          </div>
        );
      }
    }
    return component;
  };

  switch (type) {
    case 'Page':
      return (
        <div style={{ padding: '24px', backgroundColor: '#f5f7fa' }}>
          {renderChildren('24px')}
        </div>
      );

    case 'Header':
      return maybeWrapWithDraggable(
        <div>
          <Heading size="large" style={{ marginBottom: '16px' }}>
            {props.title || 'Page Title'}
          </Heading>
          {renderChildren('12px')}
        </div>
      );

    case 'Section':
      return maybeWrapWithDraggable(
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
      return maybeWrapWithDraggable(
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
      return maybeWrapWithDraggable(
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

      return maybeWrapWithDraggable(
        <ButtonComponent style={{ width: 'fit-content' }}>
          {props.text || props.children || 'Button'}
        </ButtonComponent>
      );

    case 'Form':
      return (
        <form style={{ position: 'relative', minHeight: '400px', padding: '16px' }}>
          {renderSmartChildren('16px')}
        </form>
      );

    case 'Field':
      if (props.type === 'select' && props.options) {
        return maybeWrapWithDraggable(
          <div style={{ marginBottom: '16px' }}>
            {props.label && (
              <Text as="label" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
                {props.label}
              </Text>
            )}
            <Select>
              <Select.Input placeholder="Choose an option" />
              <Select.Popper>
                <Select.Card>
                  {props.options.map((opt: string, i: number) => (
                    <Select.Item key={i}>
                      {opt}
                    </Select.Item>
                  ))}
                </Select.Card>
              </Select.Popper>
            </Select>
          </div>
        );
      }

      return maybeWrapWithDraggable(
        <div style={{ marginBottom: '16px' }}>
          {props.label && (
            <Text as="label" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
              {props.label}
            </Text>
          )}
          <TextInput
            type={props.type || 'text'}
            placeholder={props.placeholder || 'Enter text...'}
            value={props.value || ''}
            disabled={props.disabled}
            required={props.required}
            id={id || `textinput-${Math.random().toString(36).substr(2, 9)}`}
            onChange={() => {}}
          />
          {props.helpText && (
            <Text as="div" style={{ fontSize: '14px', color: '#6b6b6b', marginTop: '4px' }}>
              {props.helpText}
            </Text>
          )}
          {props.error && (
            <Text as="div" style={{ fontSize: '14px', color: '#e53e3e', marginTop: '4px' }}>
              {props.error}
            </Text>
          )}
        </div>
      );

    case 'Table':
      return maybeWrapWithDraggable(
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
                        <CanvasRenderNode
                          node={cellValue}
                          isDraggableMode={isDraggableMode}
                          onPositionChange={onPositionChange}
                          onZIndexChange={onZIndexChange}
                          onCollisionDetected={onCollisionDetected}
                        />
                      </Table.Cell>
                    );
                  }

                  // Check if cell value is an image URL
                  if (cellValue && typeof cellValue === 'string') {
                    const isImageUrl = isImageURL(cellValue);
                    if (isImageUrl) {
                      return (
                        <Table.Cell key={j}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                              src={cellValue}
                              alt="Badge"
                              style={{
                                width: '48px',
                                height: '48px',
                                objectFit: 'contain',
                                borderRadius: '4px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: 'white'
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = '🖼️';
                              }}
                            />
                          </div>
                        </Table.Cell>
                      );
                    }
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
      const getStatusType = () => {
        switch (props.status) {
          case 'Active':
            return 'green';
          case 'On Leave':
            return 'orange';
          case 'Terminated':
            return 'red';
          default:
            return 'gray';
        }
      };

      const statusType = getStatusType();

      return (
        <StatusIndicator
          type={statusType as any}
          label={props.status || props.text || props.children || 'Badge'}
        />
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
      const avatarSize = props.size === 'sm' ? 'extraSmall' :
                        props.size === 'lg' ? 'large' :
                        props.size === 'xl' ? 'extraLarge' : 'medium';
      return (
        <Avatar
          name={props.name || 'User'}
          size={avatarSize as any}
          variant={props.variant || 'light'}
        />
      );

    case 'Tabs':
      const tabItems = children.filter(child => child.type === 'Tab');
      return maybeWrapWithDraggable(
        <Tabs>
          <Tabs.List>
            {tabItems.map((tab, i) => (
              <Tabs.Item key={i}>{tab.props?.label || `Tab ${i + 1}`}</Tabs.Item>
            ))}
          </Tabs.List>
          {tabItems.map((tab, i) => (
            <Tabs.Panel key={i}>
              {tab.children?.map((child, j) => (
                <CanvasRenderNode
                  key={child.id || j}
                  node={child}
                  isDraggableMode={isDraggableMode}
                  onPositionChange={onPositionChange}
                  onZIndexChange={onZIndexChange}
                  onCollisionDetected={onCollisionDetected}
                />
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
        <Banner>
          <Banner.Icon />
          <Banner.Label>{props.message || 'Banner message'}</Banner.Label>
        </Banner>
      );

    case 'Toast':
      return (
        <Toast>
          <Toast.Icon icon={systemIcons.checkCircleIcon} />
          <Toast.Message>{props.message || 'Toast message'}</Toast.Message>
        </Toast>
      );

    case 'Modal':
      // Note: Modal requires more complex state management
      // This is a simplified version with close functionality
      const modalId = `modal-${id || Math.random().toString(36).substr(2, 9)}`;

      const closeModal = () => {
        // Try multiple approaches to close the modal
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
          modalElement.remove();
        } else {
          // Fallback: find any modal with fixed position
          const modals = document.querySelectorAll('[style*="position: fixed"][style*="background-color: rgba(0, 0, 0, 0.5)"]');
          modals.forEach(modal => (modal as HTMLElement).remove());
        }

        // Also try to clear localStorage to prevent re-rendering
        try {
          const storedResponse = localStorage.getItem('workday-nlui-last-response');
          if (storedResponse) {
            const response = JSON.parse(storedResponse);
            // Remove any Modal nodes from the tree
            const removeModals = (node: any): any => {
              if (node.type === 'Modal') return null;
              if (node.children) {
                node.children = node.children.map(removeModals).filter(Boolean);
              }
              return node;
            };
            if (response.tree) {
              response.tree = removeModals(response.tree);
              localStorage.setItem('workday-nlui-last-response', JSON.stringify(response));
            }
          }
        } catch (e) {
          console.log('Could not modify localStorage');
        }

        // Force a page refresh as last resort
        setTimeout(() => window.location.reload(), 100);
      };

      return (
        <div
          id={modalId}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <Card style={{ maxWidth: '500px', width: '90%', position: 'relative' }}>
            <Card.Heading style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Heading size="small">{props.title || 'Modal'}</Heading>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#666',
                  lineHeight: '1',
                  borderRadius: '4px'
                }}
                title="Close"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                ×
              </button>
            </Card.Heading>
            <Card.Body>
              {renderChildren()}
              <div style={{
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <PrimaryButton onClick={closeModal}>
                  OK
                </PrimaryButton>
              </div>
            </Card.Body>
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

    case 'Checkbox':
      return maybeWrapWithDraggable(
        <Checkbox
          checked={props.checked}
          disabled={props.disabled}
          id={id || `checkbox-${Math.random().toString(36).substr(2, 9)}`}
        >
          {props.label || props.text || props.children || 'Checkbox'}
        </Checkbox>
      );

    case 'Radio':
      // Handle Radio Group (multiple radio buttons)
      if (props.options && Array.isArray(props.options)) {
        const groupName = props.name || id || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
        return maybeWrapWithDraggable(
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {props.label && (
              <Text as="label" style={{ fontWeight: 500, marginBottom: '4px' }}>
                {props.label}
              </Text>
            )}
            {props.options.map((option: string, index: number) => (
              <Radio
                key={index}
                name={groupName}
                value={option}
                checked={props.value === option}
                disabled={props.disabled}
                id={`${groupName}-${index}`}
              >
                {option}
              </Radio>
            ))}
          </div>
        );
      }

      // Single Radio button
      return maybeWrapWithDraggable(
        <Radio
          checked={props.checked}
          disabled={props.disabled}
          value={props.value}
          name={props.name || id || `radio-${Math.random().toString(36).substr(2, 9)}`}
          id={id || `radio-${Math.random().toString(36).substr(2, 9)}`}
        >
          {props.label || props.text || props.children || 'Radio'}
        </Radio>
      );

    case 'Switch':
      return maybeWrapWithDraggable(
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Switch
            checked={props.checked}
            disabled={props.disabled}
            id={id || `switch-${Math.random().toString(36).substr(2, 9)}`}
          />
          {(props.label || props.text || props.children) && (
            <Text as="label" htmlFor={id || `switch-${Math.random().toString(36).substr(2, 9)}`}>
              {props.label || props.text || props.children}
            </Text>
          )}
        </div>
      );

    case 'TextArea':
      return maybeWrapWithDraggable(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {props.label && (
            <Text as="label" style={{ fontWeight: 500 }}>
              {props.label}
            </Text>
          )}
          <TextArea
            placeholder={props.placeholder || 'Enter text...'}
            value={props.value}
            disabled={props.disabled}
            required={props.required}
            rows={props.rows || 4}
            id={id || `textarea-${Math.random().toString(36).substr(2, 9)}`}
          />
        </div>
      );

    case 'Tooltip':
      return maybeWrapWithDraggable(
        <Tooltip title={props.message || props.text || 'Tooltip message'}>
          <span style={{ cursor: 'help', borderBottom: '1px dashed #ccc' }}>
            {props.children || 'Hover me'}
          </span>
        </Tooltip>
      );

    case 'Layout':
      const layoutColumns = props.columns || 2;
      const gap = props.gap || '16px';

      if (props.direction === 'column' || props.type === 'stack') {
        return maybeWrapWithDraggable(
          <div style={{ display: 'flex', flexDirection: 'column', gap }}>
            {renderChildren(gap)}
          </div>
        );
      }

      // Grid layout
      return maybeWrapWithDraggable(
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layoutColumns}, 1fr)`,
            gap,
            width: '100%'
          }}
        >
          {children.map((child, i) => (
            <CanvasRenderNode
              key={child.id || i}
              node={child}
              isDraggableMode={isDraggableMode}
              onPositionChange={onPositionChange}
              onZIndexChange={onZIndexChange}
              onCollisionDetected={onCollisionDetected}
            />
          ))}
        </div>
      );

    case 'Menu':
      const menuItems = props.items || ['Option 1', 'Option 2', 'Option 3'];
      return maybeWrapWithDraggable(
        <Menu>
          <Menu.Target>
            <SecondaryButton>
              {props.buttonText || 'Menu'}
            </SecondaryButton>
          </Menu.Target>
          <Menu.Popper>
            <Menu.Card>
              <Menu.List>
                {menuItems.map((item: string, index: number) => (
                  <Menu.Item key={index}>
                    {item}
                  </Menu.Item>
                ))}
              </Menu.List>
            </Menu.Card>
          </Menu.Popper>
        </Menu>
      );

    case 'Pagination':
      const currentPage = props.currentPage || 1;
      const totalPages = props.totalPages || 5;
      const showFirstLast = props.showFirstLast !== false;

      return maybeWrapWithDraggable(
        <Pagination
          aria-label="Pagination"
          currentPage={currentPage}
          lastPage={totalPages}
          onPageChange={() => {}}
          showFirstLast={showFirstLast}
        />
      );

    case 'ColorPicker':
      return maybeWrapWithDraggable(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {props.label && (
            <Text as="label" style={{ fontWeight: 500 }}>
              {props.label}
            </Text>
          )}
          <ColorPicker
            value={props.value || '#0875e1'}
            showCustomHexInput={props.showCustomInput !== false}
          />
        </div>
      );

    case 'SegmentedControl':
      const segments = props.segments || props.options || ['Option 1', 'Option 2', 'Option 3'];
      const selectedValue = props.value || segments[0];

      return maybeWrapWithDraggable(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {props.label && (
            <Text as="label" style={{ fontWeight: 500 }}>
              {props.label}
            </Text>
          )}
          <SegmentedControl value={selectedValue}>
            {segments.map((segment: string, index: number) => (
              <SegmentedControl.Item key={index} value={segment}>
                {segment}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl>
        </div>
      );

    default:
      return (
        <Text>
          <em style={{ color: '#6b6b6b' }}>Unknown component: {type}</em>
        </Text>
      );
  }
};
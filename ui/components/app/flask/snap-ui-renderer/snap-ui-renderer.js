import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import nanoid from 'nanoid';
import { isComponent } from '@metamask/snaps-ui';
import MetaMaskTemplateRenderer from '../../metamask-template-renderer/metamask-template-renderer';
import {
  TYPOGRAPHY,
  FONT_WEIGHT,
  DISPLAY,
  FLEX_DIRECTION,
} from '../../../../helpers/constants/design-system';
import { SnapDelineator } from '../snap-delineator';
import { useI18nContext } from '../../../../hooks/useI18nContext';
import ActionableMessage from '../../../ui/actionable-message/actionable-message';
import { getSnap } from '../../../../selectors';

export const UI_MAPPING = {
  panel: (props) => ({
    element: 'Box',
    // eslint-disable-next-line no-use-before-define
    children: props.children.map(mapToTemplate),
    props: {
      display: DISPLAY.FLEX,
      flexDirection: FLEX_DIRECTION.COLUMN,
      className: 'snap-ui-renderer__panel',
    },
  }),
  heading: (props) => ({
    element: 'Typography',
    children: props.value,
    props: {
      variant: TYPOGRAPHY.H3,
      fontWeight: FONT_WEIGHT.BOLD,
    },
  }),
  text: (props) => ({
    element: 'SnapUIMarkdown',
    children: props.value,
  }),
  spinner: () => ({
    element: 'Spinner',
    props: {
      className: 'snap-ui-renderer__spinner',
    },
  }),
  divider: () => ({
    element: 'hr',
    props: {
      className: 'snap-ui-renderer__divider',
    },
  }),
  copyable: (props) => ({
    element: 'Copyable',
    props: {
      text: props.value,
    },
  }),
};

const mapToTemplate = (data) => {
  const { type } = data;
  const mapped = UI_MAPPING[type](data);
  // TODO: We may want to have deterministic keys at some point
  return { ...mapped, key: nanoid() };
};

// Component that maps Snaps UI JSON format to MetaMask Template Renderer format
export const SnapUIRenderer = ({ snapId, data }) => {
  const t = useI18nContext();
  const snap = useSelector((state) => getSnap(state, snapId));

  const snapName = snap.manifest.proposedName;

  if (!isComponent(data)) {
    return (
      <SnapDelineator snapName={snapName}>
        <ActionableMessage
          className="snap-ui-renderer__error"
          message={t('snapsUIError')}
          type="danger"
          useIcon
          iconFillColor="var(--color-error-default)"
        />
      </SnapDelineator>
    );
  }

  const sections = mapToTemplate(data);

  return (
    <SnapDelineator snapName={snapName}>
      <MetaMaskTemplateRenderer sections={sections} />
    </SnapDelineator>
  );
};

SnapUIRenderer.propTypes = {
  snapId: PropTypes.string,
  data: PropTypes.object,
};

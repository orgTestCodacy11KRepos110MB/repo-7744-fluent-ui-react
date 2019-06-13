import * as _ from 'lodash'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import * as customPropTypes from '@stardust-ui/react-proptypes'

import {
  createShorthandFactory,
  UIComponentProps,
  applyAccessibilityKeyHandlers,
  commonPropTypes,
  UIComponent,
  withControlledState,
} from '../../lib'
import { embedBehavior } from '../../lib/accessibility'
import { Accessibility } from '../../lib/accessibility/types'
import Icon, { IconProps } from '../Icon/Icon'
import Image, { ImageProps } from '../Image/Image'
import Video, { VideoProps } from '../Video/Video'
import Box from '../Box/Box'
import { ComponentEventHandler, WithAsProp, ShorthandValue, withSafeTypeForAs } from '../../types'

export interface EmbedSlotClassNames {
  control: string
}

export interface EmbedProps extends UIComponentProps {
  /**
   * Accessibility behavior if overridden by the user.
   * @default embedBehavior
   * */
  accessibility?: Accessibility

  /** Whether the embedded object should be active. */
  active?: boolean

  /** Whether the embedded object should start active. */
  defaultActive?: boolean

  /** Shorthand for an control. */
  control?: ShorthandValue<IconProps>

  /** Shorthand for an embedded iframe. */
  iframe?: ShorthandValue

  /**
   * Event for request to change 'active' value.
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onActiveChanged?: ComponentEventHandler<EmbedProps>

  /**
   * Called when is clicked.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All item props.
   */
  onClick?: ComponentEventHandler<EmbedProps>

  /** Image source URL for when video isn't playing. */
  placeholder?: ShorthandValue<ImageProps>

  /** Shorthand for an embedded video. */
  video?: ShorthandValue<VideoProps>
}

export interface EmbedState {
  active: boolean
}

class Embed extends UIComponent<WithAsProp<EmbedProps>, EmbedState> {
  static create: Function

  static className = 'ui-embed'

  static displayName = 'Embed'

  static propTypes = {
    ...commonPropTypes.createCommon({
      children: false,
      content: false,
    }),
    active: PropTypes.bool,
    defaultActive: PropTypes.bool,
    control: customPropTypes.itemShorthand,
    iframe: customPropTypes.itemShorthand,
    onActiveChanged: PropTypes.func,
    onClick: PropTypes.func,
    placeholder: PropTypes.string,
    video: customPropTypes.itemShorthand,
  }

  static defaultProps = {
    as: 'span',
    accessibility: embedBehavior as Accessibility,
    control: {},
    defaultActive: false,
  }

  static slotClassNames: EmbedSlotClassNames = {
    control: `${Embed.className}__control`,
  }

  actionHandlers = {
    performClick: event => this.handleClick(event),
  }

  state = {
    active: this.props.defaultActive,
  }

  getControlledState = withControlledState(() => this.props, () => this.state)

  handleClick = e => {
    e.stopPropagation()
    e.preventDefault()

    this.setState({ active: !this.getControlledState().active })

    _.invoke(this.props, 'onActiveChanged', e, {
      ...this.props,
      active: !this.getControlledState().active,
    })
    _.invoke(this.props, 'onClick', e, { ...this.props, active: !this.getControlledState().active })
  }

  renderComponent({ ElementType, classes, accessibility, unhandledProps, styles, variables }) {
    const { control, iframe, placeholder, video } = this.props
    const { active } = this.getControlledState()

    return (
      <ElementType
        className={classes.root}
        onClick={this.handleClick}
        {...accessibility.attributes.root}
        {...applyAccessibilityKeyHandlers(accessibility.keyHandlers.root, unhandledProps)}
        {...unhandledProps}
      >
        {active ? (
          <>
            {Video.create(video, {
              defaultProps: {
                autoPlay: true,
                controls: false,
                loop: true,
                muted: true,
                styles: styles.video,
                variables: {
                  width: variables.width,
                  height: variables.height,
                },
              },
            })}
            {Box.create(iframe, { defaultProps: { as: 'iframe' } })}
          </>
        ) : (
          Image.create(placeholder, {
            defaultProps: {
              styles: styles.image,
              variables: {
                width: variables.width,
                height: variables.height,
              },
            },
          })
        )}

        {Icon.create(control, {
          defaultProps: {
            className: Embed.slotClassNames.control,
            circular: true,
            name: active ? 'stardust-pause' : 'stardust-play',
            size: 'largest',
            styles: styles.control,
          },
        })}
      </ElementType>
    )
  }
}

Embed.create = createShorthandFactory({ Component: Embed })

/**
 * An embed component displays a placeholder and matching content based on user's interaction.
 *
 * @accessibility
 * A `placeholder` slot represents an [`Image`](/components/image) component, please follow recommendations from its
 * accessibility section.
 */
export default withSafeTypeForAs<typeof Embed, EmbedProps, 'span'>(Embed)
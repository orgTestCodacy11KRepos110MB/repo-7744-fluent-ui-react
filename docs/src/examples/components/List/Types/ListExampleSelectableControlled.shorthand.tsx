import * as React from 'react'
import { List, Image } from '@stardust-ui/react'

let items = [
  {
    key: 'irving',
    media: <Image avatar />,
    header: 'Irving Kuhic',
    headerMedia: '7:26:56 AM',
    content: 'Program the sensor to the SAS alarm through the haptic SQL card!',
  },
  {
    key: 'skyler',
    media: <Image avatar />,
    header: 'Skyler Parks',
    headerMedia: '11:30:17 PM',
    content: 'Use the online FTP application to input the multi-byte application!',
  },
  {
    key: 'dante',
    media: <Image avatar />,
    header: 'Dante Schneider',
    headerMedia: '5:22:40 PM',
    content: 'The GB pixel is down, navigate the virtual interface!',
  },
]

items = [...items, ...items]
items = [...items, ...items]
items = [...items, ...items]

class SelectableListControlledExample extends React.Component<any, any> {
  state = { selectedIndex: -1, show: false }

  render() {
    return (
      <>
        <button onClick={() => this.setState({ show: !this.state.show })}>Show</button>
        {this.state.show && (
          <List
            selectable
            selectedIndex={this.state.selectedIndex}
            onSelectedIndexChange={(e, newProps) => {
              alert(
                `List is requested to change its selectedIndex state to "${
                  newProps.selectedIndex
                }"`,
              )
              this.setState({ selectedIndex: newProps.selectedIndex })
            }}
            items={items}
          />
        )}
      </>
    )
  }
}

export default SelectableListControlledExample

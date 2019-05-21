import React from 'react'
import './Experiment.css'
import { random } from 'lodash'

const DIAMETERS = [5, 10, 15, 20, 30, 40, 50]

class Experiment extends React.Component {
  state = {
    isChasing: false,
    isWaitingForChasing: false,
    experimentResults: { 5: [], 10: [], 15: [], 20: [], 30: [], 40: [], 50: [] },
    currentChaseStartTime: 0,
    currentDiameter: 0,
    currentMonsterOffsetX: 0,
    currentMonsterOffsetY: 0
  }

  /**
   * Start chasing of object with mouse cursor. Hide green dot and show monster.
   */
  handleStartChasing = (e) => {
    const { experimentResults, isWaitingForChasing } = this.state

    if (isWaitingForChasing) return

    const diametersNotDone = Object.entries(experimentResults)
      .filter(([dia, results]) => results.length < 20)
      .map(([dia]) => parseInt(dia))

    const currentDiameter = diametersNotDone[random(0, diametersNotDone.length - 1)]
    const currentMonsterOffsetX = random(0, 1024 - currentDiameter, true)
    const currentMonsterOffsetY = random(0, 768 - currentDiameter, true)

    this.setState({
      isChasing: false,
      isWaitingForChasing: true
    }, () => setTimeout(() => this.setState({
      isChasing: true,
      currentChaseStartTime: new Date(),
      currentDiameter,
      currentMonsterOffsetX,
      currentMonsterOffsetY
    }), random(0, 3000)))
  }

  /**
   * Monster has been clicked. Stop the current iteration and
   * log results.
   */
  handleStopChasing = (e) => {
    const {
      currentDiameter,
      currentChaseStartTime,
      currentMonsterOffsetX,
      currentMonsterOffsetY,
      experimentResults
    } = this.state

    const elapsedTime = new Date() - currentChaseStartTime

    this.setState({
      experimentResults: {
        ...experimentResults,
        [currentDiameter]: [
          ...experimentResults[currentDiameter],
          { x: currentMonsterOffsetX, y: currentMonsterOffsetY, time: elapsedTime }
        ],
      },
      isChasing: false,
      isWaitingForChasing: false,
      currentDiameter: 0,
      currentMonsterOffsetX: 0,
      currentMonsterOffsetY: 0
    })
  }

  render() {
    const {
      isChasing,
      isWaitingForChasing,
      currentDiameter,
      currentMonsterOffsetX,
      currentMonsterOffsetY
    } = this.state

    return <div className='wrapper'>
      { isChasing
        ? <div
            className='monster'
            onClick={this.handleStopChasing}
            style={{
              width: currentDiameter,
              height: currentDiameter,
              top: currentMonsterOffsetY,
              left: currentMonsterOffsetX
            }}
          />
        : !isWaitingForChasing && <div
            className='green-dot'
            onMouseOver={this.handleStartChasing}
          />
      }
    </div>
  }
}

export default Experiment

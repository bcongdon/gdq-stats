import React from "react";
import Stat from "./Stat";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Grid from "react-bootstrap/lib/Grid";
import Col from "react-bootstrap/lib/Col";
import DropdownButton from "react-bootstrap/lib/DropdownButton";
import MenuItem from "react-bootstrap/lib/MenuItem";
import {
  DONATION_TRACKER_URL,
  OFFLINE_MODE,
  EVENT_SHORT_NAME,
  EVENT_YEAR
} from "../constants";

const STATS = [
  {
    title: OFFLINE_MODE ? "Max Viewers" : "Viewers",
    emoji: "📺",
    key: "viewers"
  },
  {
    title: "Donations",
    emoji: "💸",
    key: "donations",
    prefix: "$"
  },
  {
    title: "Number of Donations",
    emoji: "🙌",
    key: "donors"
  },
  {
    title: "Twitch Chats",
    emoji: "💬",
    key: "chats"
  },
  {
    title: "Twitch Emotes",
    emoji: <img src="/img/kappa.png" width="22" alt="kappa" />,
    key: "emotes"
  },
  {
    title: "Tweets Tweeted",
    emoji: "🐦",
    key: "tweets"
  }
];

class StatsContainer extends React.PureComponent {
  static propTypes = {
    timeseries: PropTypes.array.isRequired,
    timeseriesLoaded: PropTypes.bool.isRequired
  };

  accumulateStats() {
    return this.props.timeseries.reduce(
      (prev, curr) => {
        return {
          c: prev.c + curr.c,
          e: prev.e + curr.e,
          t: prev.t + curr.t
        };
      },
      { c: 0, e: 0, t: 0 }
    );
  }

  getLatestData(timeseries, dataKey) {
    for (let i = timeseries.length - 1; i > 0; i--) {
      if (timeseries[i][dataKey] >= 0) {
        return timeseries[i][dataKey];
      }
    }
    return 0;
  }

  getValues() {
    const accumulated = this.accumulateStats();

    let viewers = this.getLatestData(this.props.timeseries, "v");

    // Display max viewers if in online mode
    if (OFFLINE_MODE) {
      viewers = this.props.timeseries.reduce(
        (prev, curr) => (prev > curr.v ? prev : curr.v),
        0
      );
    }

    const values = {
      viewers: viewers,
      donations: this.getLatestData(this.props.timeseries, "m"),
      donors: this.getLatestData(this.props.timeseries, "d"),
      chats: accumulated.c,
      emotes: accumulated.e,
      tweets: accumulated.t
    };

    // Force waiting until all data has arrived before rendering stats
    if (!this.props.timeseriesLoaded) {
      Object.keys(values).forEach(k => {
        values[k] = 0;
      });
    }

    return values;
  }

  render() {
    const values = this.getValues();

    const stats = STATS.map((s, idx) => (
      <Stat
        title={s.title}
        emoji={s.emoji}
        prefix={s.prefix}
        value={values[s.key] || 0}
        key={idx}
      />
    ));
    return (
      <div className="section">
        <h2>Event Stats</h2>
        <Grid className="current_stats content">{stats}</Grid>
        <Grid className="gdq-links">
          <Col xs={12} lg={3} sm={6}>
            <DropdownButton title={"GDQ Links"} id="gdq-links">
              <MenuItem
                eventKey="1"
                href="https://www.twitch.tv/gamesdonequick"
              >
                Livestream
              </MenuItem>
              <MenuItem eventKey="2" href="http://gdqvods.com/event/agdq-2019/">
                VODs
              </MenuItem>
              <MenuItem eventKey="3" href={DONATION_TRACKER_URL}>
                Donation Tracker
              </MenuItem>
              <MenuItem eventKey="4" href="https://gamesdonequick.com/schedule">
                Schedule
              </MenuItem>
            </DropdownButton>
          </Col>
          <Col xs={12} lg={3} sm={6}>
            <DropdownButton
              title={`More from ${EVENT_SHORT_NAME.toUpperCase()} ${EVENT_YEAR}`}
              id="additional-stats"
            >
              <MenuItem
                eventKey="1"
                href="https://www.twitch.tv/gamesdonequick"
              >
                Livestream
              </MenuItem>
              <MenuItem eventKey="2" href="http://gdqvods.com/event/agdq-2019/">
                VODs
              </MenuItem>
              <MenuItem eventKey="3" href={DONATION_TRACKER_URL}>
                Donation Tracker
              </MenuItem>
              <MenuItem eventKey="4" href="https://gamesdonequick.com/schedule">
                Schedule
              </MenuItem>
            </DropdownButton>
          </Col>
          <Col xs={12} lg={3} sm={6}>
            <DropdownButton title={"Previous Events"} id="previous-events">
              <MenuItem
                eventKey="1"
                href="https://www.twitch.tv/gamesdonequick"
              >
                Livestream
              </MenuItem>
              <MenuItem eventKey="2" href="http://gdqvods.com/event/agdq-2019/">
                VODs
              </MenuItem>
              <MenuItem eventKey="3" href={DONATION_TRACKER_URL}>
                Donation Tracker
              </MenuItem>
              <MenuItem eventKey="4" href="https://gamesdonequick.com/schedule">
                Schedule
              </MenuItem>
            </DropdownButton>
          </Col>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    timeseries: state.gdq.timeseries,
    timeseriesLoaded: state.gdq.timeseriesLoaded
  };
}

export default connect(mapStateToProps)(StatsContainer);

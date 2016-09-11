import React from 'react';
import { Link } from 'react-router';
import fetch from 'isomorphic-fetch';

class Index extends React.Component {
  static loadProps(params, cb) {
    const apiBaseUrl = params.loadContext ? params.loadContext.apiBaseUrl : window.apiBaseUrl;
    const csrfToken = params.loadContext ? params.loadContext.csrfToken : window.csrfToken;
    fetch(`${apiBaseUrl}/api/rooms`, {
      headers: { 'x-csrf-token': csrfToken },
    })
      .then((result) => result.json())
      .then((res) => {
        cb(null, { rooms: res.rooms });
      });
  }

  handleCreateNewRoom(ev) {
    ev.preventDefault();

    const apiBaseUrl = window.apiBaseUrl;
    const csrfToken = window.csrfToken;

    const room = {
      name: this.refs.newRoomName.value,
      canvas_width: 1028,
      canvas_height: 768,
    };

    if (room.name === '') {
      return; // エラーメッセージ
    }

    fetch(`${apiBaseUrl}/api/rooms`, {
      method: 'POST',
      body: JSON.stringify(room),
      headers: { 'x-csrf-token': csrfToken, 'content-type': 'application/json' },
    })
      .then((result) => result.json())
      .then((res) => { // TODO: エラー処理
        this.context.router.push({ pathname: `/rooms/${res.room.id}`, query: '', state: '' });
      });
  }

  render() {
    return (
      <div className="index">
        <div>
          <form onSubmit={(ev) => this.handleCreateNewRoom(ev)}>
            <label>
              新規部屋名:
              <input type="text" placeholder="例: ひたすら椅子を描く部屋" ref="newRoomName" />
            </label>
            <input type="hidden" name="token" value="" />
            <button type="submit">作成する</button>
          </form>
        </div>
        <div className="mdl-grid">
          {this.props.rooms.map((room) => (
            <div className="mdl-cell mdl-cell--3-col mdl-card mdl-shadow--2dp" key={room.id}>
              <div className="mdl-card__media">
                <img
                  style={{ maxWidth: '100%' }}
                  className="thumbnail"
                  src={`/img/${room.id}`}
                  alt={room.name}
                />
              </div>
              <div className="mdl-card__supporting-text">
                <h2 className="mdl-card__title-text">{room.name}</h2>
                <p>{room.watcherCount}人が参加</p>
              </div>
              <div className="mdl-card__actions mdl-card--border">
                <Link
                  to={`/rooms/${room.id}`}
                  className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
                >
                  入室
                </Link>
              </div>
            </div>
          ))
          }
        </div>

      </div>
    );
  }
}

Index.propTypes = {
  rooms: React.PropTypes.array,
};

Index.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default Index;

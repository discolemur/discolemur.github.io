"use strict";

class Wrapper extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.setState({ top: 0, height: 0 });
  }
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll, true);
  };
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll, true);
  };
  handleScroll(event) {
    const currentTop = event.target.scrollTop;
    const height = event.target.clientHeight;
    this.setState({ height: height, top: currentTop });
  };
  render(props, state) {
    return (
      h('div', { id: 'Wrapper' },
        // Paralax Images
        h(ParalaxImages, { height: state.height, top: state.top }),
        h(Header, null),
        h(Intro, null),
        h(MePhoto, null),
        h(SubIntro, null),
        h(Professional, null),
        // this is where I really want the eclipse picture to slide through.
        h(Invisible, { height: '40%', maxHeight: '40%' }),
        h(Personal, null),
        h(Footer, null)
      )
    )
  }
}

function ParalaxImages(props) {
  const height = props.height;
  const top = props.top;
  let useFirst = true;
  if (top > height) {
    useFirst = false;
  }
  return (
    h('div', null,
      h('div', { id: 'Hero', className: useFirst ? 'Paralax set' : 'Paralax unset' }),
      h('div', { id: 'AfterProfessional', className: useFirst ? 'Paralax unset' : 'Paralax set' })
    )
  )
}

function Header(props) {
  return (
    h('div', { id: "Header" },
      h('div', { id: "Bar" },
        h('div', { className: "item" },
          h('a', { href: "#Professional" }, 'my work')
        ),
        h('div', { className: "item" },
          h('a', { href: "#Personal" }, 'my life')
        )
      )
    )
  )
}

function Intro(props) {
  return (
    h('div', { id: 'intro' },
      h('div', { id: "HeroText" },
        h('div', { id: 'Title' }, 'NICK JENSEN'),
        h('div', { id: 'Subtitle' }, 'professional website')
      )
    )
  )
}

function MePhoto(props) {
  return (
    h('div', { id: 'MePhoto' },
      h('img', { src: '/static/img/nick.jpg' })
    )
  )
}

function SubIntro(props) {
  return (
    h('div', { id: "SubIntro" },
      h('div', { id: "Title" }, "I\'m a creator"),
      h(Scroll3D, { items: personalScrollItems })
    )
  )
}

function Professional(props) {
  const items = proContent.map(elem => ProfessionalItem(elem));
  return (
    h('div', { id: 'Professional' },
      h('span', { className: 'BodyTitle' }, 'Professional Background'),
      items
    )
  )
}

function ProfessionalItem(props) {
  const iconSrc = props.iconSrc;
  const timeStr = props.timeStr;
  const title = props.title;
  const subtitle = props.subtitle;
  const subsubtitle = props.subsubtitle;
  const description = props.description;
  const ref = props.ref;
  const footnotes = props.footnotes;
  const subtitleDOM = h('span', { id: 'subtitle' }, subtitle);
  const subtitleLinkDOM = ref && subtitle ? h('a', { href: ref, id: 'subtitle' }, subtitle) : subtitleDOM;
  const titleDOM = h('span', { id: 'title' }, title);
  const titleLinkDOM = h('a', { href: ref, id: 'title' }, title);
  const descriptionDOM = [];
  let closeTriggers = [];
  function closeAll() {
    closeTriggers.forEach(f=>f());
  }
  description.split('\n').map(part => {
    let lineDOM = [];
    part = part.split('[').forEach(subpart => {
      if (subpart.length > 1 && subpart[1] == ']') {
        lineDOM.push(h(Footnote, { closeAll: closeAll, setCloseTrigger: (t)=>closeTriggers.push(t), content: footnotes[subpart[0] - 1], num: subpart[0] }));
        lineDOM.push(' ');
        lineDOM.push(subpart.substr(2));
      } else {
        lineDOM.push(subpart);
      }
    })
    descriptionDOM.push(h('span', { className: 'description' }, lineDOM));
  })
  return (
    h('div', { className: 'ProItem' },
      h('div', { className: "ProIcon" },
        iconSrc ? h('img', { src: iconSrc }) : null
      ),
      h('div', { className: 'ProTimeframe' },
        h('span', null, timeStr)
      ),
      h('div', { className: 'ProText' },
        subtitle ? titleDOM : titleLinkDOM,
        subtitle ? subtitleLinkDOM : null,
        subsubtitle ? h('span', { id: 'subsubtitle' }, subsubtitle) : null,
        descriptionDOM
      )
    )
  )
}

class Footnote extends Component {
  constructor(props) {
    super(props);
    this.state.open = false;
    this.close = () => this.setState({ open: false });
    this.open = () => {props.closeAll(); this.setState({ open: true });};
    props.setCloseTrigger(this.close);
  }
  render(props, state) {
    const contentDOM = props.content
      .split('\n')
      .map(part=>h('span', {style: 'display: block;'}, part));
    return (
      h('div', { className: "footnoteContainer" },
        h('a', null, h('sup', { className: "footnoteNumber clickable", onMouseDown: (e) => { e.stopPropagation(); e.preventDefault(); this.open(); } }, props.num)),
        state.open ? h('div', { className: "footnote" },
          h('a', null, h('span', { className: "closeBtn clickable", onMouseDown: (e) => { e.stopPropagation(); e.preventDefault(); this.close(); } }, 'x')),
          h('p', { className: "footnoteContent" }, contentDOM)
        ) : null
      )
    )
  }
}

function Invisible(props) {
  return h('div', { id: 'Invisible', style: `height: ${props.height}; max-height: ${props.maxHeight};` });
}

function Personal(props) {
  const contentDOM = personalContent
    .split('\n')
    .map(part=>h('span', {style: 'display: block;'}, part));
  return (
    h('div', { id: 'Personal' },
      h('span', { className: 'BodyTitle' }, 'About Me'),
      h('div', { id: 'PersonalContent' },
        h('div', { id: "PersonalPhoto" },
          h('img', { src: "/static/img/sitting.jpg" })
        ),
        h('div', { id: 'PersonalParagraph' }, contentDOM),
        h('div', { id: 'PersonalLinks' },
          h('a', { href: "http://github.com/discolemur" },
            h('span', null, 'See my work'),
            h('img', { src: '/static/img/GitHub-Mark-64px.png' })
          ),
          h('div', { id: "github-badge" }),
          h('a', { href: "http://www.linkedin.com/in/nick-jensen-92261413a" },
            h('span', null, 'View my profile'),
            h('img', { src: "/static/img/In-2C-41px-R.png" })
          )
        )
      )
    )
  )
}

function Footer(props) {
  const footnotes = [];
  return (
    h('div', { id: 'Footer' },
      h('p', null, '© 2018 Nick Jensen — Hosted on GitHub Pages'),
      h('div', null,
        h('span', { id: 'credits' }, 'Icon made from ',
          h('a', { href: "http://www.onlinewebfonts.com/icon" }, 'Icon Fonts'),
          h('span', null, ' (the flask in the intro section) is licensed by CC BY 3.0')
        )
      )
    )
  )
}

render(h(Wrapper), document.getElementById('Main'));
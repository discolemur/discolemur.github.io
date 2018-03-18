"use strict";

class Wrapper extends Component {
  constructor(props) {
    super(props);
  }
  render(props, state) {
    return (
      h('div', {id:'Wrapper'},
        h(Header, null),
        h(Intro, null),
        h(MePhoto, null),
        h(SubIntro, null),
        h(Professional, null),
        h(Personal, null),
        h(Footer, null)
      )
    )
  }
}

function Header (props) {
  return (
    h('div', {id:"Header"},
      h('div', {id:"Bar"},
        h('div', {className:"item"},
          h('a', {href:"#Professional"}, 'my work')
        ),
        h('div', {className:"item"},
          h('a', {href:"#Personal"}, 'my life')
        )
      )
    )
  )
}

function Intro (props) {
  return (
    h('div', {id:'intro'},
      h('img', {src: '/static/img/heroBackground.jpg', id:'Hero'}),
      h('div', {id: "HeroText"},
        h('div', {id:'Title'}, 'NICK JENSEN'),
        h('div', {id:'Subtitle'}, 'professional website')
      )
    )
  )
}

function MePhoto (props) {
  return (
    h('div', {id: 'MePhoto'},
      h('img', {src: '/static/img/nick.jpg'})
    )
  )
}

function SubIntro (props) {
  return (
    h('div', {id: "SubIntro"},
      h('div', {id: "Title"}, "I\'m a creator"),
      h('div', {id: "Subtitle"},
        h('div', {id: "item"},
          h('span', null, "Developer"),
          h('img', {src: '/static/img/python.svg'})
        ),
        h('div', {id: "item"},
          h('span', null, "Researcher"),
          h('img', {src: '/static/img/python.svg'})
        ),
        h('div', {id: "item"},
          h('span', null, "Chainmail Artist"),
          h('img', {src: '/static/img/python.svg'})
        )
      )
    )
  )
}

function Professional (props) {
  return (
    h('div', {id: 'Professional'},
      h('span', {className: 'BodyTitle'}, 'Professional Background')
    )
  )
}

function Personal (props) {
  return (
    h('div', {id: 'Personal'},
      h('span', {className: 'BodyTitle'}, 'About Me')
    )
  )
}

function Footer (props) {
  return (
    h('div', {id:'Footer'},
      h('p', null, '© 2018 Nick Jensen — Hosted on GitHub Pages')
    )
  )
}

render(h(Wrapper), document.getElementById('Main'));

/*

        <div id=details>
<h1><a id="professional" class="anchor" href="#professional" aria-hidden="true"><span class="octicon octicon-link"></span></a>Professional Background</h1>
<table id="protable">
  <tr>
    <td>
      <img src="/static/nodejs-original.svg" />
    </td>
    <td>
      <h4>Present</h4>
    </td>
    <td>
      <h3>Server-Side App Developer</h3>
      <h4>Kinwaretech</h4>
      <p>We created a solution to a prevalent social issue.</p>
      <p>I developed most of the server, including noSQL database access methods.</p>
      <p>I quickly learned NodeJs on the job.</p>
    </td>
  </tr>
  <tr>
    <td>
      <img src="/static/python.svg" />
    </td>
    <td>
      <h4>2017</h4>
    </td>
    <td>
      <h3>Freelance Python Consultant</h3>
      <p>MQTT communications for TinkerBoard</p>
      <p>Applied Tensorflow machine learning</p>
    </td>
  </tr>
  <tr>
    <td>
      <img src="/static/moroni_on_the_tyne.png" />
    </td>
    <td>
      <h4>2015 &#8211 2017</h4>
    </td>
    <td>
      <h3>Volunteer Missionary</h3>
      <h4>The Church of Jesus Christ of Latter-day Saints</h4>
      <p> </p>
      <h5>Newcastle Upon Tyne, England</h5>
      <p>I helped people live happier and more purposefully.</p>
      <p>I also learned to speak Mandarin Chinese.</p>
    </td>
  </tr>
  <tr>
    <td>
      <img src="/static/BYU_medallion.svg" />
    </td>
    <td>
      <h4>2011 &#8211 2015</h4>
    </td>
    <td>
      <h3>Bachelor of Science: Bioinformatics</h3>
      <h4>Brigham Young University</h4>
      <p> </p>
      <h5>Minors: Mathematics and Computer Science</h5>
      <p> </p>
      <p>Magna Cum Laude</p>
      <p>Honored Student of the Biology Department</p>
    </td>
  </tr>
  <tr>
    <td>
      <img src="/static/dragonfly.png" />
    </td>
    <td>
      <h4>2014 &#8211 2015</h4>
    </td>
    <td>
      <h3>Research Assistant</h3>
      <h4>Brigham Young University</h4>
      <p><a href="http://bybeelab.byu.edu/">Dr. Seth Bybee's Lab</a></p>
      <p>Phylogeny construction from NGS data, comparing methods for phylogeny construction, identifying false orthologs among putative homolog clusters.</p>
    </td>
  </tr>
  <tr>
    <td>
      <img src="/static/c-line.svg" />
    </td>
    <td>
      <h4>2014</h4>
    </td>
    <td>
      <h3>Teacher's Assistant</h3>
      <h5>CS 235</h5>
      <h5>Brigham Young University</h5>
      <p>Taught students to write, test, and debug C++ code.</p>
    </td>
  </tr>
</table>
<h1><a id="personal" class="anchor" href="#personal" aria-hidden="true"><span class="octicon octicon-link"></span></a>About Me</h1>
<table id="pertable">
  <tr>
    <td>
        <img src="/static/sitting.jpg" />
    </td>
    <td>
        <p>Yeah, I know this is the most important part of my website to get right. Someday I will write a paragraph about myself. Until then, I'll keep working on my projects.</p>
    </td>
    <td>
      <p><a href="http://github.com/discolemur">Nick Jensen on GitHub</a></p>
      <p><a href="http://www.linkedin.com/in/nick-jensen-92261413a">Nick Jensen on LinkedIn</a></p>
    </td>
  </tr>
</table>
      </details>
    </section>
        </div>
*/
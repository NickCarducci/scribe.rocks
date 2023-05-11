import React from "react";
import Cable from "./Dropwire";
import TwitterTweetEmbed from "./TwitterTweetEmbed";
import { UAParser } from "ua-parser-js";
/*import firebase from "./init-firebase.js";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  getDoc,
  updateDoc,
  setDoc,
  increment
} from "firebase/firestore";*/

export default class App extends React.Component {
  constructor(props) {
    super(props);
    var parser = new UAParser();
    const name = parser.getBrowser().name;
    console.log(name);
    //const firestore = getFirestore(firebase);
    document.cookie = "";
    this.state = {
      posts: [],
      trigger: false,
      //firestore,
      browser: name,
      scrollTop: 0,
      serviceCancelingImages: name.includes("Safari")
    };
    for (let i = 0; i < 220; i++) {
      this["scrollImg" + i] = React.createRef();
    }
  }
  componentDidMount = () => {
    //document.getElementsByTagName("body")[0].style.margin = 0;
    document.body.style.margin = 0;
    window.addEventListener("resize", this.refresh);
    window.addEventListener("scroll", this.handleScroll);
    this.refresh(true);

    /* onSnapshot(doc(this.state.firestore, "countData", "only"), (doc) => {
      if (doc.exists()) {
        var foo = doc.data();
        foo.id = doc.id;
        this.setState({ signatures: foo.count });
      }
    });
    onSnapshot(collection(this.state.firestore, "posts"), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        if (doc.exists()) {
          var foo = doc.data();
          foo.id = doc.id;
          this.setState({ posts: foo.count });
        }
      });
    });*/
  };
  componentWillUnmount = () => {
    document.body.style.margin = null;
    clearTimeout(this.scrollTimeout);
    clearTimeout(this.resizeTimer);
    window.removeEventListener("resize", this.refresh);
    window.removeEventListener("scroll", this.handleScroll);
  };
  handleScroll = (e) => {
    if (!this.state.offScroll) {
      const scrollTop = window.scrollY;
      this.setState(
        {
          scrolling: true,
          scrollTop
        },
        () => {
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = setTimeout(() => {
            this.setState({
              scrolling: false
            });
          }, 900);
        }
      );
    }
  };
  refresh = (first) => {
    const width =
      (this.state.ios ? window.screen.availWidth : window.innerWidth) - 20;
    if (first || Math.abs(this.state.lastWidth - width) > 0) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.setState({
          lastWidth: width,
          width,
          availableHeight: this.state.ios
            ? window.screen.availHeight - 20
            : window.innerHeight
        });
      }, 600);
    }
  };
  /*handleSubmit = (e) => {
    e.preventDefault();
    if (
      this.state.first !== "" &&
      this.state.last !== "" &&
      this.state.address !== "" &&
      this.state.city !== "" &&
      this.state.zip !== ""
    ) {
      /*console.log("do");
      firebase
        .firestore()
        .collection("signatures")
        .where("first", "==", this.state.first)
        .where("middle", "==", this.state.middle)
        .where("last", "==", this.state.last)
        .where("address", "==", this.state.address)
        .where("city", "==", this.state.city)
        .where("zip", "==", this.state.zip)
        .get()
        .then((doc) => {
          if (doc.exists) {
            window.alert("you've signed! 🎉");
          } else {*

      addDoc(collection(getFirestore(firebase), "signatures"), {
        first: this.state.first,
        middle: this.state.middle,
        last: this.state.last,
        address: this.state.address,
        city: this.state.city,
        zip: this.state.zip
      }).then(() => {
        this.setState({ finished: true });
        const counts = collection(getFirestore(firebase), "countData");

        getDoc(doc(counts, "only"))
          .then((dc) => {
            if (dc.exists()) {
              updateDoc(doc(counts, "only"), {
                count: increment(1)
              });
            } else {
              setDoc(doc(counts, "only"), {
                count: increment(1)
              });
            }
          })
          .then(() => {
            window.alert("you've signed! 🎉");
            this.setState({ finished: true });
          })
          .catch((err) => {
            console.log(err.message);
            this.setState({ finished: true });
          });
      });
    } else
      return window.alert(
        "please complete required fields, all except middle name"
      );
  };*/
  componentDidUpdate = (prevProps) => {
    if (this.props.pathname !== prevProps.pathname) {
      clearTimeout(this.check);
      const check = () => {
        if (this.props.pathname !== "/") {
          this.setState({ trigger: true });
        }
        if (this.props.pathname === "/edu") {
          //window.scroll(0, this.edu.current.offsetTop);
        }
      };
      check();
      this.check = setTimeout(check, 4000);
    }
  };
  render() {
    //const { posts } = this.state;
    const handleScollImgError = (e) => {
      if (e.message) {
        console.log(e.message);
        this.setState({ serviceCancelingImages: true });
      }
    };
    let arrayOfnumbers = 0;
    const scrollnum = () => {
      arrayOfnumbers = arrayOfnumbers + 1; //arrayOfnumbers[arrayOfnumbers.length - 1] + 1;
      //arrayOfnumbers.push(num);
      //console.log(arrayOfnumbers)
      return arrayOfnumbers;
    };
    const space = " ";
    /*const scrollPath = (scrollPath) =>
      [this.state.hoverPath, this.state.scrollPath].includes(scrollPath)
        ? "2px solid"
        : "0px solid";
    const hoverpathe = (ev) =>
      ev.target &&
      ev.target.href &&
      this.setState({
        hoverPath: ev.target.href.split(`${window.location.origin}/`)[1]
      });*/
    return (
      <div
        style={{
          width: "calc(100% - 40px)",
          margin: "10px",
          overflow: "hidden",
          fontFamily: "arial, sans serif",
          wordBreak: "break-word",
          textAlign: "left",
          maxWidth: "600px"
        }}
      >
        {/*<Cable
          style={{}}
          onError={handleScollImgError}
          //img={true}
          src={
            this.state.noyout
              ? ""
              : "https://www.youtube.com/embed/AQ7h_U5G0fY?start=112"
          }
          float={"right"}
          title="Here I cite the Ad Council slander of marijuana users causing accidents, but same per capita prevalence as usage, generally, and the conflict of interests of expiring premium name your price false bid pool surrendered freedom of co-signatories’ customers, liability implied of contractor by https://youtu.be/AQ7h_U5G0fY?t=112"
          scrolling={this.state.scrolling}
          fwd={this["scrollImg" + scrollnum()]}
          scrollTopAndHeight={this.state.scrollTop + window.innerHeight}
          scrollTop={this.state.scrollTop}
        />*/}
        <div
          style={{
            display: this.props.pathname === "/privacy" ? "block" : "none"
          }}
        >
          There is no information collected on our servers, but for social
          features your rock messages will be shared. A chat service may encrypt
          without session keys permitting passing a background check.
        </div>
        <div
          style={{
            display: this.props.pathname === "/choices" ? "block" : "none"
          }}
        >
          You can copy and paste your information or download a csv.
        </div>
        <div
          style={{
            display: this.props.pathname === "/" ? "block" : "none"
          }}
        >
          Welcome to Scriberocks. (Find us in the App Store).
        </div>
      </div>
    );
  }
}

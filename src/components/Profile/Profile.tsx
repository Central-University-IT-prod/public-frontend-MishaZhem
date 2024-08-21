import Header from "../Header/Header";
import styles from "./Profile.module.scss";
import { Fight, Friends, RequestsFight, Summary, User } from "./ExtraComponents";

function Profile() {
	return (
        <>
            <Header firstName="Главная" firstTo="/main" secondName="Магазин" secondTo="/shop"></Header>
            <div className={styles.Main}>
                <div className={styles.FirstLine}>    
                    <User/>
                    <Summary/>
                </div>
                <Friends/>
                <div className={styles.FirstLine}> 
                    <RequestsFight/>
                    <Fight/>
                </div>
            </div>
        </>
	);
  }

export default Profile;

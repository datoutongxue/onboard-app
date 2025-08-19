<template>
  <van-dialog
    class="yscss"
    async-close
    v-model:show="dialogShow"
    title="隐私政策"
    :show-cancel-button="true"
    :before-close="onBeforeClose"
  >
    <div style="max-height: 60vh; overflow-y: auto; padding-right: 4px">
      <p class="text_indent">
        欢迎您成为博彦科技股份有限公司及附属机构（以下简称“博彦科技”）一员，并成为E-cology办公平台的注册用户，我们非常重视您的隐私和个人信息保护。本隐私政策适用于您对E-cology的访问和使用留存的信息。
      </p>
      <p class="text_indent">
        本隐私政策仅适用于E-cology产品和服务。本隐私政策旨在帮助您了解以下内容：
      </p>
      <p class="text_indent">一、我们如何收集和使用您的个人信息</p>
      <p class="text_indent">二、我们如何使用 Cookie 和同类技术</p>
      <p class="text_indent">三、我们如何共享、转让、公开披露您的个人信息</p>
      <p class="text_indent">四、我们如何保护您的个人信息</p>
      <p class="text_indent">五、您的权利</p>
      <p class="text_indent">六、响应您的上述请求</p>
      <p class="text_indent">七、您的个人信息如何在全球范围内转移</p>
      <p class="text_indent">八、隐私政策的变更和修订</p>
      <p class="text_indent">九、如何联系我们</p>
      <p class="text_indent">十、隐私政策的生效</p>
      <p class="text_indent">
        请在使用E-cology前，务必仔细阅读并了解本《隐私政策》，在确认充分理解并同意后使用我们的产品或服务。一旦您开始使用E-cology，即表示您已充分理解并同意本政策，并同意我们按照本隐私政策收集、使用、储存和分享您的相关信息。如对本政策内容有任何疑问、意见或建议，您可通过本隐私政策提供的各种联系方式与我们联系。
      </p>

      <p class="text_indent bold">一、我们如何收集和使用您的个人信息</p>
      <p class="text_indent">
        为了提高日常办公效能，在您成为博彦科技正式员工时，您需要使用E-Cology产品和服务，以便您在博彦工作期间顺利开展工作，因此，我们可能会收集、保存和使用下列与您有关的信息才能实现上述这些功能。如果您不提供相关信息，您将无法享受相关服务。
      </p>
      <p class="text_indent">（一）我们会出于本隐私政策所述的以下目的，收集和使用您的个人信息：</p>
      <p class="text_indent">
        1、E-Cology用户注册，正式入职时需注册成为E-Cology的用户，以满足日常办公需要；
      </p>
      <p class="text_indent">
        2、办理在博彦科技工作期间的个税缴纳、社保公积金缴纳、薪资发放、紧急联系、背景调查、组织关系调动、费用报销、信息核实、信息送达、员工管理等事项；
      </p>
      <p class="text_indent">
        3、如人员为外包人员，经客户方要求，相关信息可能用于办理客户方入场手续及在客户方提供服务使用或项目招投标使用。
      </p>
      <p class="text_indent">
        （二）因上述对信息的使用可能是多项或交叉的，因此，我们需要综合收集和使用您的下列信息：
      </p>
      <p class="text_indent">1、信息类型</p>
      <p class="text_indent">
        （1）基本信息: 姓名、国籍、民族、出生日期、籍贯、户口性质、婚姻状况、生育状况、档案存放情况
      </p>
      <p class="text_indent">（2）身份信息：证件类型（身份证、护照或其他）、证件号码</p>
      <p class="text_indent">（3）政治面貌：党员、其他</p>
      <p class="text_indent">（4）英语水平：英语、日语、其他</p>
      <p class="text_indent">
        （5）联系方式：现居地址、现居地邮编、家庭地址、家庭地址邮编、家庭电话、手机号码、Email
      </p>
      <p class="text_indent">（6）财产信息：银行类别、开户行名称、银行卡号</p>
      <p class="text_indent">
        （7）学习经历：开始日期、结束日期、教育类型、学历证书、学位、机构/学校、学习内容（专业）、员工技能证书
      </p>
      <p class="text_indent">
        （8）工作经历:首次参加工作的时间、开始日期、结束日期、单位、职务、联系人及电话
      </p>
      <p class="text_indent">（9）家庭信息：家庭人员姓名、所在单位、关系、联系电话</p>
      <p class="text_indent">
        （10）社保信息：新建社保（参加险种、委托代发银行卡号、公积金账号）；续保信息（姓名、身份证号、五险一金缴纳截止日期、定点医疗）
      </p>
      <p class="text_indent">
        2、您提供的上述信息，将在您工作期间持续授权我们使用，在您离职时，我们将停止使用上述信息。上述信息我们将保留2年，保留期届满，将予以删除。
      </p>
      <p class="text_indent">
        3、上述信息将存储于中国人民共和国境内，如需跨境传输，我们将单独征得您的授权同意。
      </p>
      <p class="text_indent">
        4、当我们要将信息用于本隐私政策未载明的其他用途，或基于特定目的收集而来的信息用于其他目的时，会事先征求您的同意。
      </p>

      <p class="text_indent bold">二、我们如何使用 Cookie 和同类技术</p>
      <p class="text_indent">（一）cookie</p>
      <p class="text_indent">
        为确保网站正常运转，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。Cookie
        通常包含标识符、站点名称以及一些号码和字符。Cookie主要的功能是便于您使用网站产品和服务，运用Cookie技术，我们能够为您提供更加周到的个性化服务。
      </p>
      <p class="text_indent">
        我们不会将 Cookie 用于本隐私政策所述目的之外的任何用途。您可根据自己的偏好管理或删除
        Cookie。有关详情请参见 AboutCookies.org。您可以清除计算机上保存的所有
        Cookie，大部分网络浏览器都设有阻止 Cookie
        的功能。但如果您这么做，则需要在每一次访问我们的网站时亲自更改用户设置。您可以通过更改您的浏览器设置限制我们对Cookie的使用。具体路径如下：
      </p>
      <p class="text_indent">
        IE浏览器Cookie数据位于：%APPDATA%\Microsoft\Windows\Cookies\ 目录中的xxx.txt文件；
      </p>
      <p class="text_indent">
        Firefox的Cookie数据位于：%APPDATA%\Mozilla\Firefox\Profiles\
        目录中的xxx.default目录，名为cookies.sqlite的文件
      </p>
      <p class="text_indent">（二）DO Not Track (请勿追踪)</p>
      <p class="text_indent">
        很多网络浏览器均设有DO Not Track功能，该功能可向网站发布DO Not
        Track请求。目前，主要互联网标准组织尚未设立相关政策规定网站应如何应对此类请求，但如果您的浏览器启用了DO
        Not Track，那我们的所有网站都会尊重您的选择。
      </p>

      <p class="text_indent bold">三、我们如何共享、转让、公开披露您的个人信息</p>
      <p class="text_indent">（一）共享</p>
      <p class="text_indent">我们不会与任何公司、组织和个人共享您的个人信息，但以下情况除外：</p>
      <p class="text_indent">1、在获得您明确同意的情况下，我们会与其他方共享您的个人信息。</p>
      <p class="text_indent">
        2、我们可能会根据法律法规规定、诉讼争议解决需要，或按行政、司法机关依法提出的要求，对外共享您的个人信息。
      </p>
      <p class="text_indent">
        3、我们可能将您的个人信息与我们的关联方共享，我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束，关联方如要改变个人信息的处理目的，将再次征求您的授权同意。
      </p>
      <p class="text_indent">
        4、我们可能会与合作伙伴等第三方共享您的某些个人信息，以便更好地履行工作职责。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享与提供服务相关的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。
      </p>
      <p class="text_indent">
        对我们与之共享个人信息的公司、组织和个人，我们会与其签署严格的保密协定，要求他们按照我们的说明、本隐私政策以及其他任何相关的保密和安全措施来处理个人信息。
      </p>
      <p class="text_indent">（二）转让</p>
      <p class="text_indent">
        我们不会将您的个人信息转让给其他任何公司、组织和个人，但以下情形除外：
      </p>
      <p class="text_indent">1、事先获得您的明确授权或同意；</p>
      <p class="text_indent">2、根据法律法规、法律程序、诉讼或政府主管部门强制性要求；</p>
      <p class="text_indent">
        3、如果涉及合并、分立、清算、资产或业务的收购或出售等交易时，如涉及到个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受此隐私政策的约束，否则我们将要求该公司、组织重新向您征求授权同意。
      </p>
      <p class="text_indent">（三）公开披露</p>
      <p class="text_indent">我们仅会在以下情况下，公开披露您的个人信息：</p>
      <p class="text_indent">1、获得您的明确同意；</p>
      <p class="text_indent">2、在法律、法律程序、诉讼或政府主管部门强制性要求的情况下。</p>
      <p class="text_indent">（四）共享、转让、公开披露个人信息时事先征得授权同意的例外</p>
      <p class="text_indent">
        在以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：
      </p>
      <p class="text_indent">1、与国家安全、国防安全直接相关的；</p>
      <p class="text_indent">2、与公共安全、公共卫生、重大公共利益直接相关的；</p>
      <p class="text_indent">3、与犯罪侦查、起诉、审判和判决执行等直接相关的；</p>
      <p class="text_indent">4、出于维护您或其他个人、组织的等合法权益的；</p>
      <p class="text_indent">5、您自行向社会公众公开的个人信息；</p>
      <p class="text_indent">6、从政府信息公开等合法渠道收集个人信息的；</p>
      <p class="text_indent">
        7、法律法规规定的其他情形。根据法律规定，共享、转让经去标识化处理的个人信息，且确保数据接收方无法复原并重新识别个人信息主体的，不属于个人信息的对外共享、转让及公开披露行为，对此类数据的保存及处理将无需另行向您通知并征得您的同意。
      </p>

      <p class="text_indent bold">四、我们如何保护您的个人信息</p>
      <p class="text_indent">
        为保障您的信息安全，我们努力采取各种符合业界标准的物理、电子和管理方面的安全措施来保护您的个人信息，建立数据分类分级制度、数据安全管理规范、数据安全开发规范来管理规范个人信息的存储和使用。我们通过信息接触者保密协议、监控和审计机制来对数据进行全面安全控制。防止您的个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。例如在您的浏览器与“服务”之间交换数据时采用SSL加密保护技术；同时对网站本身提供https安全浏览方式;使用加密技术确保数据的保密性;使用受信赖的保护机制防止数据遭到恶意攻击;部署访问控制机制，确保只有授权人员才可访问个人信息；我们已先后通过了ISO27001，ISO20000，ISO9000信息安全管理体系国际认证等认证资质，并与监管机构、第三方测评机构建立了良好的协调沟通机制，及时抵御并处置各类信息安全威胁；以及举办安全和隐私保护培训课程，加强员工对于保护个人信息重要性的认识；为您的信息安全提供全方位保障。
      </p>

      <p class="text_indent bold">五、您的权利</p>
      <p class="text_indent">
        我们非常重视您对个人信息的关注，并尽全力保护您对于您个人信息访问、更正、删除以及撤回同意的权利，以使您拥有充分的能力保障您的隐私和安全，
        在您使用E-cology期间，您可以通过以下方式访问并管理您的个人信息：
      </p>
      <p class="text_indent">（一）访问您的个人信息</p>
      <p class="text_indent">
        您有权访问您的个人信息，法律法规规定的例外情况除外。您可以通过以下方式自行访问您的个人信息：账户信息——如果您希望访问您的账户中的个人基本资料信息、联系方式信息、更改您的密码、添加安全信息等，您可以通过E-cology执行此类操作。如果您想行使数据访问权，请登录E-cology系统查看相应的内容。您在使用我们的产品和服务过程中产生的其他个人信息，只要我们不需要过多投入，我们会向您提供，您可通过is@beyondsoft.com与我们联系。
      </p>
      <p class="text_indent">（二）更正您的个人信息</p>
      <p class="text_indent">
        您应准确填写您的个人信息，填写过程中如您填写有误或信息变更，您可以通过E-cology对上述信息进行更正；信息提交后如您发现我们处理的关于您的个人信息有错误时，您可以通过hrrz@beyondsoft.com与我们联系。
      </p>
      <p class="text_indent">（三）删除您的个人信息</p>
      <p class="text_indent">
        以下情况发生时，您可以向我们提出删除您的个人信息：1、如果我们处理个人信息违法了法律法规；2、如果我们收集、使用您的个人信息，却未征得您的同意；3、如果我们处理个人信息的行为违反了与您的约定；4、如果您不再使用我们的产品或服务，或您注销了账号；5、如果我们不再为您提供产品或服务。您可以通过本隐私政策提供的方式联系我们要求删除您的个人信息，我们会在30个工作日内给予答复。当我们从服务器中删除您的个人信息后，我们可能不会立即从备份系统中删除相应的数据，但会在备份更新的时候删除这些信息。
      </p>
      <p class="text_indent">（四）撤回您的同意或授权</p>
      <p class="text_indent">
        每个业务功能需要一些基本的个人信息才能得以完成（见本政策“第一部分”),
        对于额外收集的个人信息的收集和使用，您可以随时给与或收回您的授权同意。您可以通过以下方式自行操作：你可以发送邮件到is@beyondsoft.com和hr@intra.beyondsoft.com请求撤回申请，同时需要告知对应的个人信息使用部门。当您撤回同意或授权后，我们无法继续为您提供撤回同意或授权所对应的服务，也将不再处理相应的个人信息。但您撤回同意的决定，不会影响此前基于您的授权而开展的个人信息处理。
      </p>
      <p class="text_indent">（五）个人信息主体注销账户</p>
      <p class="text_indent">
        在您离职后，我们会及时注销您的账户，在注销账户之后，我们将停止为您提供产品或服务，并依据本隐私政策删除您的个人信息，法律法规另有规定的除外。
      </p>
      <p class="text_indent">（六）提前获知产品和服务停止运营</p>
      <p class="text_indent">
        E-cology愿一直陪伴您，若因特殊原因导致E-cology产品和服务被迫停止运营，我们将按照法律法规要求在产品和/或服务的主页面或其他合适的能触达您的方式通知您，并将停止对您个人信息的收集，同时会按照法律规定对所持有您的个人信息进行删除或匿名化处理等。
      </p>

      <p class="text_indent bold">六、响应您的上述请求</p>
      <p class="text_indent">
        为了保障安全，您可能需要提供书面请求，或以其他方式证明您的身份，我们可能会先要求您验证自己的身份，然后再处理您的请求。
        对于您的合理地请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情况收取一定成本费用。对于那些无端重复、需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者非常不切实际（例如，涉及备份磁带上存放的信息）的请求，我们可能会予以拒绝。
      </p>
      <p class="text_indent">在以下情形中，按照法律法规要求，我们将无法响应您的上述请求：</p>
      <p class="text_indent">（一）国家安全、国防安全直接相关的；</p>
      <p class="text_indent">（二）与公共安全、公共卫生、重大公共利益直接相关的；</p>
      <p class="text_indent">（三）与犯罪侦查、起诉、审判和执行判决等直接相关的；</p>
      <p class="text_indent">
        （四）我们有充分证据表明您存在主观恶意或滥用权利的（如您的请求将危害公共安全和其他人合法权益，或您的请求超出了一般技术手段和商业成本可覆盖的范围）；
      </p>
      <p class="text_indent">
        （五）响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的；
      </p>
      <p class="text_indent">（六）涉及商业秘密的。</p>

      <p class="text_indent bold">七、您的个人信息如何在全球范围转移</p>
      <p class="text_indent">
        原则上，我们在境内收集和产生的个人信息，将存储于境内。如部分产品或服务涉及跨境，我们需要向境外传输您的个人信息，我们会事先获得您的书面同意并严格按照法律法规的规定执行，并保证您的个人信息安全。
      </p>

      <p class="text_indent bold">八、隐私政策的变更和修订</p>
      <p class="text_indent">
        随着业务的发展，我们的隐私政策可能会随时更新。但未经您明确同意，我们不会削减您按照本隐私政策所应享有的权利。我们会发布对本政策所做的任何变更。
        若您不同意该等变更可以停止使用E-cology产品和服务，若您继续使用我们的产品和/或服务，即表示您同意受修订后的本隐私政策的约束。
        对于本隐私政策的重大变更，我们还会提供显著的通知（例如，在软件改版或升级、或您重新登录时，以弹窗形式对您进行及时通知）。
        本政策所指的重大变更包括但不限于：
      </p>
      <p class="text_indent">
        （一）我们的服务模式发生重大变化，如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等；
      </p>
      <p class="text_indent">
        （二）我们在所有权结构、组织架构等方面发生重大变化，如业务调整、破产并购等引起的所有者变更等；
      </p>
      <p class="text_indent">（三）个人信息共享、转让或公开披露的主要对象发生变化；</p>
      <p class="text_indent">（四）您参与个人信息处理方面的权利及其行使方式发生重大变化；</p>
      <p class="text_indent">
        （五）我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化时；
      </p>
      <p class="text_indent">（六）个人信息安全影响评估报告表明存在高风险时。</p>

      <p class="text_indent bold">九、如何联系我们</p>
      <p class="text_indent">
        如果您对我们的隐私政策及对您个人信息的处理有任何疑问、意见、建议或投诉，请通过以下方式与我们联系。
        网址：e-cology.beyondsoft.com 邮箱：is@beyondsoft.com
        在一般情况下，我们会在30个工作日内对您的请求予以答复。
      </p>

      <p class="text_indent bold">十、隐私政策的生效</p>
      <p class="text_indent">
        本隐私政策版本于【2019】年【09】月【01】日正式生效。
        您可通过网站查看我们有关隐私保护的详细内容，网址为：e-cology.beyondsoft.com
      </p>
      <p>
        <van-checkbox v-model="isAgree" shape="square">
          【已阅读并知悉《隐私政策》内容，同意按照《隐私政策》授权公司使用个人信息】
        </van-checkbox>
      </p>
    </div>
  </van-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { showToast } from 'vant'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits<{ (e: 'update:show', v: boolean): void }>()

const dialogShow = computed({
  get: () => props.show,
  set: (v: boolean) => emit('update:show', v),
})

const isAgree = ref(false)

const onBeforeClose = (action: 'confirm' | 'cancel', done: (ok?: boolean) => void) => {
  if (action === 'confirm') {
    if (!isAgree.value) {
      showToast({ message: '请阅读《隐私政策》', position: 'middle' })
      dialogShow.value = true
      return done(false)
    }
    dialogShow.value = false
    done(true)
  } else {
    showToast({ message: '请阅读《隐私政策》', position: 'top' })
    dialogShow.value = true
    done(false)
  }
}
</script>

<style scoped>
.text_indent {
  text-indent: 2em;
}
.bold {
  font-weight: bold;
}
</style>
